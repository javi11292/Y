import { followUser } from "$lib/database/user";
import { withSession } from "$lib/utils/api";

export const POST = withSession(async ({ locals, request }) => {
	const { id } = await request.json();
	await followUser({ follower: locals.user.id, id });

	return new Response();
});
