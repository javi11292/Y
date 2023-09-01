import { connect } from "$lib/server/database";
import { minify } from "html-minifier";

const minifyOptions = {
	collapseBooleanAttributes: true,
	collapseWhitespace: true,
	minifyJS: true,
	removeAttributeQuotes: true,
	removeOptionalTags: true,
	removeRedundantAttributes: true,
	removeScriptTypeAttributes: true,
	removeStyleLinkTypeAttributes: true,
};

const promise = connect();

export const handle = async ({ event, resolve }) => {
	let page = "";
	await promise;

	return resolve(event, {
		transformPageChunk: ({ html, done }) => {
			page += html;
			if (done) {
				return minify(page, minifyOptions);
			}
		},
	});
};
