import { get } from "$lib/commons/utils/fetch";
import { getData } from "$lib/commons/utils/load.svelte";
import type { Post } from "$lib/database";
import { store } from "$lib/stores.svelte";

type Data = [{ post: Post | null; replies: Post[] | null } | null];

const cache: Record<string, Promise<Data>> = {};

export const data = getData({
	id: "thread",

	load: ({ args: id, data }: { args: string; data: Data }) => {
		if (!data[0]) {
			return;
		}

		const [{ post, replies }] = data;

		if (!post || !replies) {
			return;
		}

		if (!(id in cache)) {
			cache[id] = Promise.resolve(data);
		}

		if (!store.posts.elements[post.id]) {
			store.posts.elements[post.id] = post;
		}

		store.posts = { ...store.posts };

		return replies.map((element) => {
			if (!store.posts.elements[element.id]) {
				store.posts.elements[element.id] = element;
			}
			return element.id;
		});
	},

	fetch: (id: string) => {
		return cache[id] || Promise.all([get<Post[] | null>(`/api/post/thread/${id}`)]);
	},
});
