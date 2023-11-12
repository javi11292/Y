import type { User } from "$lib/database";

export const addUser = (users: Record<string, User>, user: User) => {
	if (!users[user.id]) {
		users[user.id] = user;
	}
};
