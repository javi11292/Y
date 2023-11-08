import { getSessionToken } from "$lib/utils/session";
import { defineMiddleware, sequence } from "astro:middleware";

const redirectUser = defineMiddleware((context, next) => {
	const { locals, url, redirect } = context;

	if (url.pathname.startsWith("/api")) {
		return next();
	}

	const login = url.pathname === "/login" || url.pathname === "/register";

	if (!locals.user && !login) {
		return redirect("/login", 307);
	}

	if (locals.user && login) {
		return redirect("/", 307);
	}

	return next();
});

export const addUser = defineMiddleware((context, next) => {
	const { locals, cookies } = context;

	const username = getSessionToken(cookies);

	if (username) {
		locals.user = true;
	}

	return next();
});

export const onRequest = sequence(addUser, redirectUser);
