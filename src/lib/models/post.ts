import type { WithId } from "mongodb";

export type Post = {
	content: string;
	author: string;
	date: Date;
	likes: number;
};

export type PostId = WithId<Post>;
