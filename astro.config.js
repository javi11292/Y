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
					urlPattern: () => true,
					handler: "NetworkFirst",
					options: {
						cacheName: "cache",
					},
				},
			],
		});
	},
};

// https://astro.build/config
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
