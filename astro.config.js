import cloudflare from "@astrojs/cloudflare";
import svelte from "@astrojs/svelte";
import { defineConfig } from "astro/config";
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
					urlPattern: ({ url }) => !/^\/_astro/.test(url.pathname),
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
