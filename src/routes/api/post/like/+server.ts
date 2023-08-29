import { likePost } from "$lib/server/database/post";
import { getUser } from "$lib/server/database/user";
import { getSessionToken } from "$lib/server/utils/session";
import { error } from "@sveltejs/kit";

export const POST = async ({ request, cookies }) => {
	const { id } = await request.json();
	const author = getSessionToken(cookies);

	if (!id) {
		throw error(400, "ID requerida");
	}

	if (!author) {
		throw error(400, "Autor requerido");
	}

	const user = await getUser(author);

	if (!user) {
		throw error(400, "Usuario requerido");
	}

	await likePost(id, author, !user.likedPosts.includes(id));

	return new Response();
};
