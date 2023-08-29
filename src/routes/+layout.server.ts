import type { User } from "$lib/models/user";
import { redirect } from "@sveltejs/kit";

export const load = async ({ fetch, url }) => {
	const response = await fetch("/api/user");

	if (!response.ok && url.pathname !== "/login" && url.pathname !== "/register") {
		throw redirect(307, "/login");
	}

	if (response.ok && (url.pathname === "/login" || url.pathname === "/register")) {
		throw redirect(307, "/");
	}

	const user = (await response.json()) as User;

	return { username: user.username, likedPosts: new Set(user.likedPosts) };
};
