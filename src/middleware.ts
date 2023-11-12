import { load, posts, users } from "$lib/stores";
import { addSession } from "$lib/utils/api";
import { createServerClient } from "@supabase/ssr";
import type { AstroGlobal } from "astro";
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

export const addUser = defineMiddleware(async (context, next) => {
	const { url, locals, cookies } = context;

	locals.supabase = createServerClient(import.meta.env.SUPABASE_URL, import.meta.env.SUPABASE_KEY, {
		cookies: {
			get(key) {
				return cookies.get(key)?.value;
			},
			set(key, value, options) {
				cookies.set(key, value, options);
			},
			remove(key, options) {
				cookies.delete(key, options);
			},
		},
	});

	if (url.pathname.startsWith("/api")) {
		return next();
	}

	posts.set({ elements: {}, all: [], following: [] });
	users.set({});
	load.post = true;

	await addSession(context as unknown as AstroGlobal);

	return next();
});

export const onRequest = sequence(addUser, redirectUser);
