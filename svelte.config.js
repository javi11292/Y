import { vitePreprocess } from "@astrojs/svelte";

export default {
	preprocess: vitePreprocess({
		style: {
			css: {
				preprocessorOptions: {
					scss: {
						importer: [
							(url) => {
								if (url.startsWith("$lib")) {
									return {
										file: url.replace("$", "src/"),
									};
								}
								return url;
							},
						],
					},
				},
			},
		},
	}),
};
