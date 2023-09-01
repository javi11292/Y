import type { User } from "$lib/models/user";
import { redirect } from "@sveltejs/kit";

export const load = async ({ fetch, depends, locals }) => {
	depends("user");
	const response = await fetch("/api/user");

	if (!response.ok && !locals.login) {
		throw redirect(307, "/login");
	}

	if (response.ok && locals.login) {
		throw redirect(307, "/");
	}

	const user = (await response.json()) as User;

	return {
		username: user.username,
		likedPosts: new Set(user.likedPosts),
		following: new Set(user.following),
	};
};
