import { getUser } from "$lib/server/database/user";
import { getSessionToken } from "$lib/server/utils/session";
import { error, json } from "@sveltejs/kit";

export const GET = async ({ cookies }) => {
	const token = getSessionToken(cookies);

	if (!token) {
		throw error(400, "Usuario no encontrado");
	}

	const user = await getUser(token);

	if (!user) {
		throw error(400, "Usuario no encontrado");
	}

	const { password: _, ...fields } = user;

	return json(fields);
};
