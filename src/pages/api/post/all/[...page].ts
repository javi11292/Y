import { getPosts } from "$lib/database/post";
import type { AstroGlobal } from "astro";

export const GET = async ({ params, locals }: AstroGlobal) => {
	return new Response(JSON.stringify(await getPosts(locals.supabase, params.page)));
};
