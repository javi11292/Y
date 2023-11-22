import { get } from "$lib/commons/utils/fetch";
import { getData } from "$lib/commons/utils/load.svelte";
import type { Post, User } from "$lib/database";
import { store } from "$lib/stores.svelte";

type Data = [User | null, Post[] | null];

const cache: Record<string, Data> = {};

export const data = getData({
	id: "user",

	load: ({ args: id, data: [user, posts] }: { args: string; data: Data }) => {
		const response = { user, posts };

		if (!user || !posts) {
			return;
		}

		cache[id] = [user, posts];

		if (store.users[user.id]) {
			return response;
		}

		store.users[user.id] = {
			...user,
			posts: posts.map((post) => {
				store.posts.elements[post.id] = post;
				store.posts = { ...store.posts };
				return post.id;
			}),
		};

		return response;
	},

	fetch: (id: string) => {
		if (cache[id]) {
			return cache[id];
		}

		return Promise.all([
			get<User | null>(`/api/user/${id}`),
			get<Post[] | null>(`/api/post/${id}`),
		]);
	},
});
