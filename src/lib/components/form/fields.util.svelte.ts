export const createState = <T extends {}>(object: T) => {
	return Object.entries(object).reduce<T>((acc, [key, initial]) => {
		let state = $state(initial);

		Object.defineProperty(acc, key, {
			get: () => state,
			set: (value: T) => (state = value),
			enumerable: true,
		});

		return acc;
	}, object);
};
