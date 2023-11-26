import { getPosts } from "$lib/database/post";
import { withSession } from "$lib/utils/api";

export const GET = withSession(async ({ params, locals }) => {
	return new Response(
		JSON.stringify(await getPosts({ id: params.page, user: locals.user.id, name: params.user })),
	);
});
