export const prerender = false;

export const load = ({ fetch, depends }) => {
	depends("posts");

	return {
		streamed: { posts: fetch("/api/post").then((response) => response.json()) },
	};
};
