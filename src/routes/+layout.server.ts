import type { PostId } from "$lib/models/post";
import { redirect } from "@sveltejs/kit";

const normalize = (initial: Record<string, PostId>) => (posts: PostId[]) =>
	posts?.map?.((post) => {
		initial[post._id] = post;
		return post._id;
	}, initial);

export const load = async ({ fetch, depends, locals }) => {
	depends("user");

	const login = locals.pathname === "/login" || locals.pathname === "/register";

	if (!locals.user && !login) {
		throw redirect(307, "/login");
	}

	if (locals.user && login) {
		throw redirect(307, "/");
	}

	const posts = {};

	const [all, following] = await Promise.all([
		fetch("/api/post/all")
			.then((response) => response.json() as Promise<PostId[]>)
			.then(normalize(posts)),
		fetch("/api/post/following")
			.then((response) => response.json() as Promise<PostId[]>)
			.then(normalize(posts)),
	]);

	return {
		username: locals.user?.username,
		likedPosts: new Set(locals.user?.likedPosts),
		following: new Set(locals.user?.following),
		posts: { elements: posts, all, following },
	};
};
