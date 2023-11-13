import { getLoading } from "$lib/commons/utils/load";
import type { Post } from "$lib/database";
import { updatePosts } from "$lib/stores";

const { loading, resolve } = getLoading();

const load = (data: null | { all: Post[]; following: Post[] }) => {
	if (data) {
		updatePosts(data);
	}

	resolve();
};

export { load, loading };
