import { getLoading } from "$lib/commons/utils/load";
import type { Post } from "$lib/database";
import { loadPosts } from "$lib/stores";

const { loading, resolve } = getLoading();

const load = (data: null | { posts: Post[]; following: Post[] }) => {
	if (data) {
		loadPosts(data.posts, data.following);
	}

	resolve();
};

export { load, loading };
