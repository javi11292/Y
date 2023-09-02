import { browser } from "$app/environment";

type Id = string | number | symbol;

export const setupCache = <T>() => {
	if (!browser) {
		return {
			bustCache: () => null,
			getCache: (_: Id, callback: () => Promise<T>) => callback(),
		};
	}

	const cache: Record<Id, Promise<T>> = {};

	return {
		bustCache: (id: Id) => delete cache[id],
		getCache: (id: Id, callback: () => Promise<T>) => {
			if (!cache[id]) {
				cache[id] = callback();
			}

			return cache[id];
		},
	};
};
