import { createServerClient } from "@supabase/ssr";
import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
	const { locals, cookies } = context;
	console.log(import.meta.env.SUPABASE_URL);
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

	const { data } = await locals.supabase.auth.getSession();

	locals.user = data.session?.user;

	return next();
});
