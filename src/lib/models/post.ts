export type Post = {
	content: string;
	author: string;
	date: Date;
	likes: number;
	replies: number;
	thread?: string;
};
