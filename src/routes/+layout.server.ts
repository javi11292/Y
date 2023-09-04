import type { PostId } from "$lib/models/post";
import type { User } from "$lib/models/user";
import { redirect } from "@sveltejs/kit";

export const load = async ({ fetch, depends, locals }) => {
	depends("user");
	depends("posts");
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
		posts: fetch("/api/post/all").then((response) => response.json() as Promise<PostId[]>),
		followingPosts: fetch("/api/post/following").then(
			(response) => response.json() as Promise<PostId[]>
		),
	};
};
