import { database } from ".";

type Post = {
	content: string;
	author: string;
};

const collection = database.collection<Post>("posts");

const PAGE_SIZE = 20;

export const getPosts = (page: number) => {
	return collection
		.aggregate([
			{ $sort: { _id: -1 } },
			{ $skip: page * PAGE_SIZE },
			{ $limit: PAGE_SIZE },
			{ $project: { _id: 0 } },
		])
		.toArray();
};

export const addPost = async (content: string, author: string) => {
	await collection.insertOne({ content, author });
};
