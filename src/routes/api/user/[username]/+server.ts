import { getUser } from "$lib/server/database/user";
import { json } from "@sveltejs/kit";

export const GET = async ({ params }) => {
	const user = await getUser(params.username);

	const { password: _, ...fields } = user;

	return json(fields);
};
