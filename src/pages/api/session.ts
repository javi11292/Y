import type { AstroGlobal } from "astro";

export const GET = async ({ locals }: AstroGlobal) => {
	return new Response(JSON.stringify(!!locals.user));
};
