import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import { generateSW } from "workbox-build";

export default defineConfig({
	plugins: [
		sveltekit(),
		{
			name: "workbox",
			writeBundle: async () => {
				await generateSW({
					swDest: ".svelte-kit/output/client/service-worker.js",
					sourcemap: false,
					skipWaiting: true,
					runtimeCaching: [
						{
							urlPattern: ({ url }) => !/^\/_app\/immutable/.test(url.pathname),
							handler: "NetworkFirst",
							options: {
								cacheName: "cache",
							},
						},
					],
				});
			},
		},
	],
	server: { port: 3000 },
	preview: { port: 3000 },
});
