import type { WithId } from "mongodb";

export type User = {
	username: string;
	password: string;
	likedPosts: string[];
	followers: number;
	following: string[];
};

export type UserId = WithId<User>;
