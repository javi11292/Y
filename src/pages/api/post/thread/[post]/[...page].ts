import { getPost } from "$lib/database/post";
import { withSession } from "$lib/utils/api";

export const GET = withSession(async ({ params, locals }) => {
	return new Response(
		JSON.stringify(
			await getPost({ id: params.page, user: locals.user.id, thread: params.post as string }),
		),
	);
});
