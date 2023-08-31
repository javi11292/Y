import { USERNAME_REGEX } from "$lib/constants";
import { addUser } from "$lib/server/database/user";
import { setSessionToken } from "$lib/server/utils/session";
import { error } from "@sveltejs/kit";

export const POST = async ({ request, cookies }) => {
	const { username, password } = await request.json();

	if (!username) {
		throw error(400, "Nombre requerido");
	}

	if (!password) {
		throw error(400, "Contraseña requerida");
	}

	if (!USERNAME_REGEX.test(username)) {
		throw error(400, "Nombre de usuario inválido");
	}

	await addUser(username, password);
	setSessionToken(cookies, username);

	return new Response();
};
