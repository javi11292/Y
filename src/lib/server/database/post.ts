import { database } from ".";

type Post = {
	content: string;
	author: string;
};

const collection = database.collection<Post>("posts");

export const getPosts = () => {
	return collection
		.find({}, { projection: { _id: 0 } })
		.sort({ _id: -1 })
		.toArray();
};

export const addPost = async (content: string, author: string) => {
	await collection.insertOne({ content, author });
};
