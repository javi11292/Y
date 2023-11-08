import type { AstroCookies } from "astro";
import { SignJWT, jwtVerify } from "jose";

const KEY = "session";

export const setSessionToken = (cookies: AstroCookies, payload: string) => {
	const jwt = new SignJWT({ payload }).sign(import.meta.env.SESSION_SECRET);

	cookies.set(KEY, jwt, {
		path: "/",
		secure: import.meta.env.PROD,
		maxAge: 3600 * 24 * 7,
	});
};

export const getSessionToken = async (cookies: AstroCookies) => {
	const token = cookies.get(KEY)?.value || "";

	try {
		return await jwtVerify(token, import.meta.env.SESSION_SECRET);
	} catch {
		return null;
	}
};

export const removeSessionToken = (cookies: AstroCookies) => {
	cookies.delete(KEY, { path: "/" });
};
