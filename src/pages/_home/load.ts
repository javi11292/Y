import { getData } from "$lib/commons/utils/data";
import type { Post } from "$lib/database";
import { updatePosts } from "$lib/stores";

const { load, loading } = getData<{ all: Post[]; following: Post[] }>((data) => {
	updatePosts(data);
});

export { load, loading };
