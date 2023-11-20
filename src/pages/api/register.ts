import { supabase } from "$lib/database/supabase";
import { addUser } from "$lib/database/user";
import { errorResponse } from "$lib/utils/api";
import type { AstroGlobal } from "astro";

const AUTH_ERROR: Record<number, string> = {
	400: "Email ya registrado",
	422: "La contraseña debe tener al menos 6 caracteres",
};

const DB_ERROR: Record<string, string> = {
	"23505": "Nombre de usuario ya en uso",
};

const getAuthError = (status?: number) => {
	return (status && AUTH_ERROR[status]) || "Error";
};

const getDBError = (error: any) => {
	return DB_ERROR[error.code] || "Error";
};

export const POST = async ({ request, locals }: AstroGlobal) => {
	const { email, password, name } = await request.json();

	if (!email) {
		return errorResponse("Email requerido", 400);
	}

	if (!password) {
		return errorResponse("Contraseña requerida", 400);
	}

	if (!name) {
		return errorResponse("Nombre de usuario requerido", 400);
	}

	if (!/^\w+$/.test(name)) {
		return errorResponse("El nombre sólo puede contener caracteres alfanuméricos", 400);
	}

	if (name.length < 2) {
		return errorResponse("El nombre debe tener al menos 2 caracteres", 400);
	}

	const { error, data } = await locals.supabase.auth.signUp({ email, password });

	if (error) {
		return errorResponse(getAuthError(error.status), 400);
	}

	if (!data.user) {
		return new Response();
	}

	try {
		await addUser({ id: data.user.id, email, name });
	} catch (error) {
		await locals.supabase.auth.signOut();
		await supabase.auth.admin.deleteUser(data.user.id);
		return errorResponse(getDBError(error), 400);
	}

	return new Response();
};
