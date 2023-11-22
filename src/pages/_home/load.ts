import { get } from "$lib/commons/utils/fetch";
import { getData } from "$lib/commons/utils/load.svelte";
import type { Post } from "$lib/database";
import { updatePosts } from "$lib/stores.svelte";

export const data = getData({
	id: "home",

	load: ({ data: [all, following] }: { data: [null | Post[], null | Post[]] }) => {
		updatePosts({ all, following });
		return true;
	},

	fetch: () => {
		if (data.response) {
			return;
		}

		return Promise.all([
			get<Post[] | null>(`/api/post/all`),
			get<Post[] | null>(`/api/post/following`),
		]);
	},
});
