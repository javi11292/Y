import { redirect } from "@sveltejs/kit";

export const prerender = true;

export const load = async ({ fetch, url }) => {
	const response = await fetch("/api/user");

	if (!response.ok && url.pathname !== "/login" && url.pathname !== "/register") {
		throw redirect(307, "/login");
	}

	if (response.ok && (url.pathname === "/login" || url.pathname === "/register")) {
		throw redirect(307, "/");
	}

	return response.json();
};
