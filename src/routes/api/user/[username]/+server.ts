import { getUser } from "$lib/server/database/user";
import { error, json } from "@sveltejs/kit";

export const GET = async ({ params }) => {
	const user = await getUser(params.username);

	if (!user) {
		throw error(400, "Usuario no encontrado");
	}

	const { password: _, ...fields } = user;

	return json(fields);
};
