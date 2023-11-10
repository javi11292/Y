import { errorResponse } from "$lib/utils/api";
import type { AstroGlobal } from "astro";

const AUTH_ERROR: Record<number, string> = {
	400: "Credenciales inválidas",
};

const getAuthError = (status?: number) => {
	return (status && AUTH_ERROR[status]) || "Error";
};

export const POST = async ({ request, locals }: AstroGlobal) => {
	const { email, password } = await request.json();

	if (!email) {
		return errorResponse("Email requerido", 400);
	}

	if (!password) {
		return errorResponse("Contraseña requerida", 400);
	}

	const { error } = await locals.supabase.auth.signInWithPassword({ email, password });

	if (error) {
		return errorResponse(getAuthError(error.status), 400);
	}

	return new Response();
};
