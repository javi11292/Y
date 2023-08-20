import { NODE_ENV, SESSION_SECRET } from "$env/static/private";
import type { Cookies } from "@sveltejs/kit";
import { sign, verify } from "jsonwebtoken";

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
	return verify(token, SESSION_SECRET);
};
