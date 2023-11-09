import { errorResponse } from "$lib/utils/api";
import type { APIRoute } from "astro";

const AUTH_ERROR = {
	400: "Email ya registrado",
	422: "La contraseña debe tener al menos 6 caracteres",
};

const isAuthError = (status: number): status is keyof typeof AUTH_ERROR => {
	return status in AUTH_ERROR;
};

export const POST: APIRoute = async ({ request, locals }) => {
	const { email, password } = await request.json();

	if (!email) {
		return errorResponse("Email requerido", 400);
	}

	if (!password) {
		return errorResponse("Contraseña requerida", 400);
	}

	const { error } = await locals.auth.signUp({ email, password });

	if (error && error.status && isAuthError(error.status)) {
		return errorResponse(AUTH_ERROR[error.status], 400);
	}

	return new Response();
};
