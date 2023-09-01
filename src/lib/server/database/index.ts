import { MONGODB_URI } from "$env/static/private";
import { MongoClient } from "mongodb";

export const client = new MongoClient(MONGODB_URI);

export const connect = () =>
	new Promise((resolve) => {
		client
			.connect()
			.then(resolve)
			.catch(() => setTimeout(() => connect().then(resolve), 1000));
	});

export const database = client.db("database");
