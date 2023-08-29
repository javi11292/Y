export type User = {
	username: string;
	password: string;
	likedPosts: string[];
};

export type UserId = {
	_id: string;
} & User;
