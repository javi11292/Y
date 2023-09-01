import type { UserId } from "$lib/models/user.js";
import { error } from "@sveltejs/kit";

export const load = ({ params, fetch, depends }) => {
	const match = params.username.match(/@(\w+)/);

	if (!match) {
		throw error(404, "Not Found");
	}

	depends("user:id");

	return {
		user: fetch(`/api/user/${match[1]}`).then((response) => response.json()) as Promise<UserId>,
	};
};
