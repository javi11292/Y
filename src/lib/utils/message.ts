import { addError } from "$lib/commons/components/snackbar";

export const showError = (error: unknown) => {
	if (
		error &&
		typeof error === "object" &&
		"message" in error &&
		typeof error.message === "string"
	) {
		addError(error.message);
	}
};
