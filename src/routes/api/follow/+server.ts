import { followUser } from "$lib/server/database/user";
import { withSession } from "$lib/server/utils/session";

export const POST = withSession(async ({ request, locals }) => {
	const { id } = await request.json();

	await followUser(locals.user, id);

	return new Response();
});
