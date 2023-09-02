import type { PostId } from "$lib/models/post";
import type { User } from "$lib/models/user";
import { error } from "@sveltejs/kit";
import { getPostsCache, getUserCache } from "./cache";

export const load = ({ params, fetch, depends }) => {
	depends("user:id");
	const match = params.username.match(/@(\w+)/);

	if (!match) {
		throw error(404, "Not Found");
	}

	const username = match[1];

	return {
		streamed: {
			user: getUserCache(
				username,
				() => fetch(`/api/user/${username}`).then((response) => response.json()) as Promise<User>
			),
			posts: getPostsCache(
				username,
				() =>
					fetch(`/api/post/user/${username}`).then((response) => response.json()) as Promise<
						PostId[]
					>
			),
		},
	};
};
