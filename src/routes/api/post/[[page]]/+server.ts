import { addPost, getPosts } from "$lib/server/database/post";
import { getSessionToken } from "$lib/server/utils/session";
import { error, json } from "@sveltejs/kit";

export const GET = async ({ params }) => {
	const { page } = params;
	return json(await getPosts(page ? parseInt(page) : 0));
};

export const POST = async ({ request, cookies }) => {
	const { content } = await request.json();
	const author = getSessionToken(cookies);

	if (!content) {
		throw error(400, "Contenido requerido");
	}

	if (!author) {
		throw error(400, "Autor requerido");
	}

	await addPost(content, author);

	return new Response();
};
