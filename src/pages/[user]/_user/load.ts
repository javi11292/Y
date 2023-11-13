import { getData } from "$lib/commons/utils/data";
import type { Post, User } from "$lib/database";
import { posts as storePosts, users as storeUsers } from "$lib/stores";

const { data, load } = getData<{ user: User | null; posts: Post[] | null }>(({ user, posts }) => {
	storeUsers.update((users) => {
		if (!user || !posts) {
			return users;
		}

		if (!users[user.id]) {
			users[user.id] = {
				...user,
				posts: posts.map((post) => {
					storePosts.update((value) => {
						value.elements[post.id] = post;
						return value;
					});

					return post.id;
				}),
			};
		}

		return users;
	});
});

export { data, load };
