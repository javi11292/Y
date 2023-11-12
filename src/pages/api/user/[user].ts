import { getUser } from "$lib/database/user";
import { withSession } from "$lib/utils/api";

export const GET = withSession(async ({ params, locals }) => {
	return new Response(
		JSON.stringify(await getUser({ name: (params.user as string).slice(1), id: locals.user.id }))
	);
});
