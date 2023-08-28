import type { Post } from "$lib/models/post";
import { ObjectId } from "mongodb";
import { database } from ".";

const collection = database.collection<Post>("posts");

const PAGE_SIZE = 20;

export const getPosts = (id?: string) => {
	return collection
		.find(id ? { _id: { $lt: new ObjectId(id) } } : {})
		.sort({ _id: -1 })
		.limit(PAGE_SIZE)
		.toArray();
};

export const addPost = async (content: string, author: string) => {
	await collection.insertOne({ content, author, date: Date.now().toString(), likes: 0 });
};
