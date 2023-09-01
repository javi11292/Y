import type { User, UserId } from "$lib/models/user";
import { hashPassword } from "$lib/server/utils/crypto";
import { error } from "@sveltejs/kit";
import { client, database } from ".";

export const collection = database.collection<User>("users");
collection.createIndex({ username: 1 }, { unique: true });

export const getUser = async (username: string) => {
	const user = collection.findOne({ username });

	if (!user) {
		throw error(400, "Usuario no encontrado");
	}

	return user as unknown as UserId;
};

export const followUser = async (username: string, followUsername: string) => {
	const session = client.startSession();

	const user = await getUser(username);
	const follow = !user.following.includes(followUsername);
	const operator = follow ? "$push" : "$pull";

	try {
		session.startTransaction();
		await collection.updateOne(
			{ username: followUsername },
			{ $inc: { followers: follow ? 1 : -1 } },
			{ session }
		);
		await collection.updateOne(
			{ username },
			{ [operator]: { following: followUsername } },
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

export const addUser = async (username: string, password: string) => {
	const user = {
		username,
		password: await hashPassword(password),
		likedPosts: [],
		followers: 0,
		following: [],
	};

	await collection.insertOne(user);
};
