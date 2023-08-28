export type Post = {
	content: string;
	author: string;
};

export type PostId = {
	_id: string;
} & Post;
