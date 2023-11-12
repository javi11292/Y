import type { LoggedAstroGlobal } from "$lib/types";
import type { AstroGlobal } from "astro";

type APIRoute = (context: LoggedAstroGlobal) => Promise<Response>;

export const errorResponse = (message: string, status: number) =>
	new Response(JSON.stringify({ message }), { status });

export const addSession = async ({ locals }: AstroGlobal) => {
	const { data } = await locals.supabase.auth.getSession();

	locals.user = data.session?.user;
};

export const withSession =
	(callback: APIRoute): APIRoute =>
	async (context) => {
		await addSession(context);

		if (!context.locals.user) {
			return errorResponse("Usuario requerido", 400);
		}

		return callback(context);
	};
