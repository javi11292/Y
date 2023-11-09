import type { APIRoute } from "astro";

export const errorResponse = (message: string, status: number) =>
	new Response(JSON.stringify({ message }), { status });

export const withSession =
	(callback: APIRoute): APIRoute =>
	(context) => {
		if (!context.locals.user) {
			return errorResponse("Usuario requerido", 400);
		}

		return callback(context);
	};
