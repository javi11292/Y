import { MAX_LENGTH } from "$lib/constants";
import { addPost } from "$lib/database/post";
import { errorResponse, withSession } from "$lib/utils/api";

export const POST = withSession(async ({ request, locals }) => {
	const { content, thread } = await request.json();

	if (!content) {
		return errorResponse("Contenido requerido", 400);
	}

	if (content.length > MAX_LENGTH) {
		return errorResponse(`Longitud máxima: ${MAX_LENGTH}`, 400);
	}

	return new Response(JSON.stringify(await addPost({ content, author: locals.user.id, thread })));
});
