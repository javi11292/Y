import type { User } from "$lib/models/user";
import { hashPassword } from "$lib/server/utils/crypto";
import { database } from ".";

const collection = database.collection<User>("users");
collection.createIndex({ username: 1 }, { unique: true });

export const getUser = (username: string) => {
	return collection.findOne({ username });
};

export const addUser = async (username: string, password: string) => {
	const user = {
		username,
		password: await hashPassword(password),
	};

	await collection.insertOne(user);
};
