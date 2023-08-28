export type Post = {
	content: string;
	author: string;
	date: Date;
	likes: number;
};

export type PostId = {
	_id: string;
} & Post;
