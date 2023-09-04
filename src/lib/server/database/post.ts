import type { Post } from "$lib/models/post";
import type { Filter } from "mongodb";
import { ObjectId } from "mongodb";
import { client, database } from ".";
import { getUser, collection as userCollection } from "./user";

const PAGE_SIZE = 20;

export const collection = database.collection<Post>("posts");
collection.createIndex({ author: 1 });

export const getPosts = (id?: string, username?: string) => {
	const filter: Filter<Post> = {};

	if (id) {
		filter._id = { $lt: new ObjectId(id) };
	}

	if (username) {
		filter.author = username;
	}

	return collection.find(filter).sort({ _id: -1 }).limit(PAGE_SIZE).toArray();
};

export const getFollowingPosts = (username: string, id?: string) => {
	return userCollection
		.aggregate([
			{ $match: { username } },
			{
				$lookup: {
					from: "posts",
					localField: "following",
					foreignField: "author",
					as: "following",
					pipeline: [
						{
							$match: {
								_id: { $lt: new ObjectId(id) },
							},
						},
					],
				},
			},
			{
				$unwind: "$following",
			},
			{
				$replaceRoot: {
					newRoot: "$following",
				},
			},
		])
		.sort({ _id: -1 })
		.limit(PAGE_SIZE)
		.toArray();
};

export const likePost = async (id: string, username: string) => {
	const session = client.startSession();
	const user = await getUser(username);

	const like = !user.likedPosts.includes(id);
	const operator = like ? "$push" : "$pull";
	try {
		session.startTransaction();
		await collection.updateOne(
			{ _id: new ObjectId(id) },
			{ $inc: { likes: like ? 1 : -1 } },
			{ session }
		);
		await userCollection.updateOne({ username }, { [operator]: { likedPosts: id } }, { session });
		await session.commitTransaction();
	} catch (error) {
		console.error(error);
		await session.abortTransaction();
	} finally {
		await session.endSession();
	}
};

export const addPost = (content: string, author: string) =>
	collection.insertOne({ content, author, date: new Date(), likes: 0 });
