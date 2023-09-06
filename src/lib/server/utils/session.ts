import { NODE_ENV, SESSION_SECRET } from "$env/static/private";
import type { Cookies, RequestHandler } from "@sveltejs/kit";
import { error } from "@sveltejs/kit";
import jsonwebtoken from "jsonwebtoken";

const { sign, verify } = jsonwebtoken;

const KEY = "session";

export const setSessionToken = (cookies: Cookies, payload: string) => {
	cookies.set(KEY, sign(payload, SESSION_SECRET), {
		path: "/",
		secure: NODE_ENV === "production",
		maxAge: 3600 * 24 * 7,
	});
};

export const getSessionToken = (cookies: Cookies) => {
	const token = cookies.get(KEY) || "";

	try {
		return verify(token, SESSION_SECRET) as string;
	} catch {
		return null;
	}
};

export const removeSessionToken = (cookies: Cookies) => {
	cookies.delete(KEY, { path: "/" });
};

export const withSession =
	(callback: RequestHandler): RequestHandler =>
	(event) => {
		if (!event.locals.user) {
			throw error(400, "Usuario requerido");
		}

		return callback(event);
	};
