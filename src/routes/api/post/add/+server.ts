import { MAX_LENGTH } from "$lib/constants";
import { addPost } from "$lib/server/database/post";
import { getSessionToken } from "$lib/server/utils/session";
import { error } from "@sveltejs/kit";

export const POST = async ({ request, cookies }) => {
	const { content } = await request.json();
	const author = getSessionToken(cookies);

	if (!content) {
		throw error(400, "Contenido requerido");
	}

	if (!author) {
		throw error(400, "Autor requerido");
	}

	if (content.length > MAX_LENGTH) {
		throw error(400, `Longitud máxima: ${MAX_LENGTH}`);
	}

	await addPost(content, author);

	return new Response();
};
