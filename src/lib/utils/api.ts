import type { LoggedAstroGlobal } from "$lib/types";

type APIRoute = (context: LoggedAstroGlobal) => Promise<Response>;

export const errorResponse = (message: string, status: number) =>
	new Response(JSON.stringify({ message }), { status });

export const withSession =
	(callback: APIRoute): APIRoute =>
	async (context) => {
		if (!context.locals.user) {
			return errorResponse("Usuario requerido", 400);
		}

		return callback(context);
	};
