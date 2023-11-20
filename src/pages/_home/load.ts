import { getData } from "$lib/commons/utils/data.svelte";
import type { Post } from "$lib/database";
import { updatePosts } from "$lib/stores.svelte";

export const data = getData<{ all: null | Post[]; following: null | Post[] }>((data) => {
	updatePosts(data);
});
