import cloudflare from "@astrojs/cloudflare";
import svelte from "@astrojs/svelte";
import { defineConfig } from "astro/config";
import { generateSW } from "workbox-build";
import { Strategy } from "workbox-strategies/Strategy";

class SessionHandler extends Strategy {
	_handle = async (request, handler) => {
		const response = await handler.cacheMatch(request);

		if (!response) {
			return handler.fetchAndCachePut(request);
		}

		if (sessionStorage.getItem(url.pathname)) {
			return response;
		}

		sessionStorage.setItem(url.pathname);

		return handler.fetchAndCachePut(request);
	};
}

const workbox = {
	name: "workbox",
	writeBundle: async () => {
		await generateSW({
			swDest: "dist/service-worker.js",
			sourcemap: false,
			skipWaiting: true,
			runtimeCaching: [
				{
					urlPattern: ({ url }) => /^\/_astro/.test(url.pathname),
					handler: "CacheFirst",
					options: {
						cacheName: "Astro",
					},
				},
				{
					urlPattern: ({ url }) => !/^\/_astro/.test(url.pathname),
					handler: new SessionHandler(),
					options: {
						cacheName: "Files",
					},
				},
			],
		});
	},
};

export default defineConfig({
	output: "server",
	scopedStyleStrategy: "class",
	server: {
		port: 3000,
	},
	vite: {
		plugins: [workbox],
	},
	adapter: cloudflare(),
	integrations: [svelte()],
});
