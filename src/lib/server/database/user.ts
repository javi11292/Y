import { hashPassword } from "$lib/server/utils/crypto";
import { database } from ".";

type User = {
	username: string;
	password: string;
};

const collection = database.collection<User>("users");
collection.createIndex({ username: 1 }, { unique: true });

export const getUser = (username: string) => {
	return collection.findOne({ username }, { projection: { _id: 0 } });
};

export const addUser = async (username: string, password: string) => {
	const user = {
		username,
		password: await hashPassword(password),
	};

	await collection.insertOne(user);
};
