import type { PostId } from "$lib/models/post";
import { redirect } from "@sveltejs/kit";

export const load = async ({ fetch, depends, locals }) => {
	depends("user");
	depends("posts");

	const login = locals.pathname === "/login" || locals.pathname === "/register";

	if (!locals.user && !login) {
		throw redirect(307, "/login");
	}

	if (locals.user && login) {
		throw redirect(307, "/");
	}

	return {
		username: locals.user?.username,
		likedPosts: new Set(locals.user?.likedPosts),
		following: new Set(locals.user?.following),
		posts: fetch("/api/post/all").then((response) => response.json() as Promise<PostId[]>),
		followingPosts: fetch("/api/post/following").then(
			(response) => response.json() as Promise<PostId[]>
		),
	};
};
