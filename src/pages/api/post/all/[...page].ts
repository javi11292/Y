import { getPosts } from "$lib/database/post";
import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ params }) => {
	return new Response(JSON.stringify(await getPosts(params.page)));
};
