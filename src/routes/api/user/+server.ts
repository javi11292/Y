import { getUser } from "$lib/server/database/user";
import { withSession } from "$lib/server/utils/session";
import { json } from "@sveltejs/kit";

export const GET = withSession(async ({ locals }) => {
	const user = await getUser(locals.username);

	const { password: _, ...fields } = user;

	return json(fields);
});
