export type Post = {
	content: string;
	author: string;
	date: string;
	likes: number;
};

export type PostId = {
	_id: string;
} & Post;
