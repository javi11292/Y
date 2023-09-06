import { MAX_LENGTH } from "$lib/constants";
import { addPost } from "$lib/server/database/post";
import { withSession } from "$lib/server/utils/session";
import { error } from "@sveltejs/kit";

export const POST = withSession(async ({ request, locals }) => {
	const { content } = await request.json();

	if (!content) {
		throw error(400, "Contenido requerido");
	}

	if (content.length > MAX_LENGTH) {
		throw error(400, `Longitud máxima: ${MAX_LENGTH}`);
	}

	await addPost(content, locals.user.username);

	return new Response();
});
