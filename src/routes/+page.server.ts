import type { PostId } from "$lib/models/post";

export const load = ({ fetch, depends }) => {
	depends("posts");

	return {
		posts: fetch("/api/post").then((response) => response.json() as Promise<PostId[]>),
	};
};
