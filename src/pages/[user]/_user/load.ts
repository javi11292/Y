import { getData } from "$lib/commons/utils/data.svelte";
import type { Post, User } from "$lib/database";
import { store } from "$lib/stores.svelte";

export const data = getData<{ user: User | null; posts: Post[] | null }>(({ user, posts }) => {
	if (!user || !posts) {
		return;
	}

	if (store.users[user.id]) {
		return;
	}

	store.users[user.id] = {
		...user,
		posts: posts.map((post) => {
			store.posts.elements[post.id] = post;
			store.posts = { ...store.posts };
			return post.id;
		}),
	};
});
