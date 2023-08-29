import type { Post } from "$lib/models/post";
import { ObjectId } from "mongodb";
import { client, database } from ".";
import { collection as userCollection } from "./user";

const PAGE_SIZE = 20;

export const collection = database.collection<Post>("posts");

export const getPosts = (id?: string) => {
	return collection
		.find(id ? { _id: { $lt: new ObjectId(id) } } : {})
		.sort({ _id: -1 })
		.limit(PAGE_SIZE)
		.toArray();
};

export const likePost = async (id: string, user: string) => {
	const session = client.startSession();
	try {
		session.startTransaction();

		await collection.updateOne({ _id: new ObjectId(id) }, { $inc: { likes: 1 } }, { session });
		await userCollection.updateOne(
			{ _id: new ObjectId(user) },
			{ $push: { likedPosts: id } },
			{ session }
		);
	} catch {
		await session.abortTransaction();
	} finally {
		await session.endSession();
	}
};

export const addPost = async (content: string, author: string) => {
	await collection.insertOne({ content, author, date: new Date(), likes: 0 });
};
