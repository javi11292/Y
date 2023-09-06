import { getFollowingPosts } from "$lib/server/database/post";
import { withSession } from "$lib/server/utils/session";
import { json } from "@sveltejs/kit";

export const GET = withSession(async ({ params, locals }) => {
	const { page } = params;
	return json(await getFollowingPosts(locals.user.username, page));
});
