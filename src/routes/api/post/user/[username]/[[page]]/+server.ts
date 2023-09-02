import { getPosts } from "$lib/server/database/post";
import { json } from "@sveltejs/kit";

export const GET = async ({ params }) => {
	const { page, username } = params;
	return json(await getPosts(page, username));
};
