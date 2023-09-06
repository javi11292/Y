import { connect } from "$lib/server/database";
import { getUser } from "$lib/server/database/user";
import { getSessionToken } from "$lib/server/utils/session";
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

const databaseConnection = connect();

export const handle = async ({ event, resolve }) => {
	await databaseConnection;
	const { locals, url, cookies } = event;

	const username = getSessionToken(cookies);

	if (username) {
		locals.user = await getUser(username).catch();
	}

	locals.pathname = url.pathname;

	let page = "";

	return resolve(event, {
		transformPageChunk: ({ html, done }) => {
			page += html;
			if (done) {
				return minify(page, minifyOptions);
			}
		},
	});
};
