import { getData } from "$lib/commons/utils/data";
import type { Post } from "$lib/database";
import { updatePosts } from "$lib/stores";

const { load, loading } = getData<{ all: null | Post[]; following: null | Post[] }>((data) => {
	updatePosts(data);
});

export { load, loading };
