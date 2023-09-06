import { likePost } from "$lib/server/database/post";
import { withSession } from "$lib/server/utils/session";
import { error } from "@sveltejs/kit";

export const POST = withSession(async ({ request, locals }) => {
	const { id } = await request.json();

	if (!id) {
		throw error(400, "ID requerida");
	}

	await likePost(id, locals.user.username);

	return new Response();
});
