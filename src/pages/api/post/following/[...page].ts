import { getFollowingPosts } from "$lib/database/post";
import type { AstroGlobal } from "astro";

export const GET = async ({ locals, params }: AstroGlobal) => {
	return new Response(
		JSON.stringify(await getFollowingPosts({ user: locals.user.id, id: params.page }))
	);
};
