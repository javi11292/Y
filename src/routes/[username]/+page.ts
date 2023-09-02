import type { User } from "$lib/models/user.js";
import { error } from "@sveltejs/kit";
import { getCache } from "./cache";

export const load = ({ params, fetch, depends }) => {
	depends("user:id");
	const match = params.username.match(/@(\w+)/);

	if (!match) {
		throw error(404, "Not Found");
	}

	const username = match[1];

	return {
		streamed: {
			user: getCache(
				username,
				() => fetch(`/api/user/${match[1]}`).then((response) => response.json()) as Promise<User>
			),
		},
	};
};
