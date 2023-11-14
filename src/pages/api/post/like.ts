import { likePost } from "$lib/database/post";
import { errorResponse, withSession } from "$lib/utils/api";

export const POST = withSession(async ({ request, locals }) => {
	const { post } = await request.json();

	try {
		await likePost({ post, user: locals.user.id });
	} catch {
		return errorResponse("", 400);
	}

	return new Response();
});
