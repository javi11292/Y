import { browser } from "$app/environment";

export const prerender = false;

export const load = ({ fetch }) => {
	if (!browser) {
		return;
	}

	return {
		posts: fetch("/api/post").then((response) => response.json()),
	};
};
