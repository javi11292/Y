type Result<T> = T extends PromiseLike<infer U> ? U : never;

export type Data<T extends () => {}> = Result<ReturnType<T>> extends { data: unknown }
	? Result<ReturnType<T>>["data"]
	: never;

export type Post = {
	author: string;
	content: string;
	date: string;
	id: number;
	likes: number;
	liked: boolean;
	replies: number;
};

export type User = {
	id: string;
	name: string;
	following: number;
	followers: number;
	followed: boolean;
};
