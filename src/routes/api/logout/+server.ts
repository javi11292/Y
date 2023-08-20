import { removeSessionToken } from "$lib/server/utils/session";

export const GET = ({ cookies }) => {
	removeSessionToken(cookies);

	return new Response();
};
