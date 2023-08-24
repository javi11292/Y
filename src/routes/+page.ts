export const prerender = false;

export const load = ({ fetch }) => {
	return {
		streamed: { posts: fetch("/api/post").then((response) => response.json()) },
	};
};
