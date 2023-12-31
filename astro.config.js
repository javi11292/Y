import cloudflare from "@astrojs/cloudflare";
import svelte from "@astrojs/svelte";
import { defineConfig, passthroughImageService } from "astro/config";
import { generateSW } from "workbox-build";

const workbox = {
	name: "workbox",
	writeBundle: async () => {
		await generateSW({
			swDest: "dist/service-worker.js",
			sourcemap: false,
			skipWaiting: true,
			runtimeCaching: [
				{
					urlPattern: ({ url }) => !/^\/(_astro|api|assets)\//.test(url.pathname),
					handler: "NetworkFirst",
					options: {
						cacheName: "Astro",
					},
				},
			],
		});
	},
};

export default defineConfig({
	scopedStyleStrategy: "class",
	output: "server",
	adapter: cloudflare(),
	integrations: [svelte()],
	server: {
		port: 3000,
	},
	vite: {
		plugins: [workbox],
	},
	image: {
		service: passthroughImageService(),
	},
});
