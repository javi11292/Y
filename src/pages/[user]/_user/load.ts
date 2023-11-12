import type { Post, User } from "$lib/database";
import type { Users } from "$lib/stores";
import { posts } from "$lib/stores";

export const addUser = (users: Users, user: User, nextPosts: Post[] = []) => {
	if (!users[user.id]) {
		users[user.id] = {
			...user,
			posts: nextPosts.map((post) => {
				posts.update((value) => {
					value.elements[post.id] = post;
					return value;
				});

				return post.id;
			}),
		};
	}
};
