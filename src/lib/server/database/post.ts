import type { Post, PostId } from "$lib/models/post";
import type { User } from "$lib/models/user";
import type { Filter } from "mongodb";
import { ObjectId } from "mongodb";
import { client, database } from ".";
import { collection as userCollection } from "./user";

const PAGE_SIZE = 20;

export const collection = database.collection<Post>("posts");
collection.createIndex({ author: 1, replyId: 1 });

export const getPosts = (id?: string, username?: string) => {
	const filter: Filter<Post> = { thread: { $exists: false } };

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
								thread: { $exists: false },
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

export const likePost = async (id: string, user: User) => {
	const session = client.startSession();

	const like = !user.likedPosts.includes(id);
	const operator = like ? "$push" : "$pull";
	try {
		session.startTransaction();
		await collection.updateOne(
			{ _id: new ObjectId(id) },
			{ $inc: { likes: like ? 1 : -1 } },
			{ session }
		);
		await userCollection.updateOne(
			{ username: user.username },
			{ [operator]: { likedPosts: id } },
			{ session }
		);
		await session.commitTransaction();
	} catch (error) {
		console.error(error);
		await session.abortTransaction();
	} finally {
		await session.endSession();
	}
};

type AddPost = (args: {
	content: string;
	author: string;
	thread?: string;
}) => Promise<PostId | void>;

export const addPost: AddPost = async ({ content, author, thread }) => {
	let _id = "";
	const session = client.startSession();

	const document: Post = {
		content,
		author,
		date: new Date(),
		likes: 0,
		replies: 0,
	};

	if (thread) {
		document.thread = thread;
	}

	try {
		session.startTransaction();
		const { insertedId } = await collection.insertOne(document, { session });
		_id = insertedId.toString();

		await collection.updateOne(
			{ _id: new ObjectId(thread) },
			{ $inc: { replies: 1 } },
			{ session }
		);
		await session.commitTransaction();
	} catch (error) {
		console.error(error);
		await session.abortTransaction();
	} finally {
		await session.endSession();
	}

	if (!_id) {
		return;
	}

	return { ...document, _id };
};
