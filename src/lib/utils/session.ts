import type { AstroCookies } from "astro";
import jsonwebtoken from "jsonwebtoken";

const { sign, verify } = jsonwebtoken;

const KEY = "session";

export const setSessionToken = (cookies: AstroCookies, payload: string) => {
	cookies.set(KEY, sign(payload, import.meta.env.SESSION_SECRET), {
		path: "/",
		secure: import.meta.env.PROD,
		maxAge: 3600 * 24 * 7,
	});
};

export const getSessionToken = (cookies: AstroCookies) => {
	const token = cookies.get(KEY)?.value || "";

	try {
		return verify(token, import.meta.env.SESSION_SECRET);
	} catch {
		return null;
	}
};

export const removeSessionToken = (cookies: AstroCookies) => {
	cookies.delete(KEY, { path: "/" });
};
