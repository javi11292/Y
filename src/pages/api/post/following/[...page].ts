import { getFollowingPosts } from "$lib/database/post";
import { withSession } from "$lib/utils/api";

export const GET = withSession(async ({ locals, params }) => {
	return new Response(
		JSON.stringify(await getFollowingPosts({ user: locals.user.id, id: params.page })),
	);
});
