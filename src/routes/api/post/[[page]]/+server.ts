import { getPosts } from "$lib/server/database/post";
import { json } from "@sveltejs/kit";

export const GET = async ({ params }) => {
	const { page } = params;
	return json(await getPosts(page));
};
