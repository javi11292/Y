export type User = {
	username: string;
	password: string;
};

export type UserId = {
	_id: string;
} & User;
