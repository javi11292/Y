import { addUser } from "$lib/server/database/user";
import { json } from "@sveltejs/kit";

export const POST = async ({ request }) => {
	const { username, password } = await request.json();

	if (!username) {
		return json({ error: "Nombre requerido" }, { status: 400 });
	}

	if (!password) {
		return json({ error: "Contraseña requerida" }, { status: 400 });
	}

	const { id } = await addUser(username, password);

	return json({ id });
};
