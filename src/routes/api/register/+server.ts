import { addUser } from "$lib/server/database/user";
import { setSessionToken } from "$lib/server/utils/session";
import { json } from "@sveltejs/kit";

export const POST = async ({ request, cookies }) => {
	const { username, password } = await request.json();

	if (!username) {
		return json({ message: "Nombre requerido" }, { status: 400 });
	}

	if (!password) {
		return json({ message: "Contraseña requerida" }, { status: 400 });
	}

	const { id } = await addUser(username, password);
	setSessionToken(cookies, id);

	return json({ id });
};
