import { getUser } from "$lib/server/database/user";
import { matchPassword } from "$lib/server/utils/crypto";
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

	const user = await getUser(username);

	if (!user || !(await matchPassword(password, user.password))) {
		throw error(400, "Usuario inválido");
	}

	setSessionToken(cookies, username);

	return new Response();
};
