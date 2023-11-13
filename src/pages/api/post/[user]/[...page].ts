import { getPosts } from "$lib/database/post";
import type { AstroGlobal } from "astro";

export const GET = async ({ params }: AstroGlobal) => {
	return new Response(JSON.stringify(await getPosts({ id: params.page, name: params.user })));
};
