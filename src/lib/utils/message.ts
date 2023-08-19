import { addError } from "$lib/commons/components/snackbar";

export const showError = (error: unknown) => {
	if (error && typeof error === "object" && "error" in error && typeof error.error === "string") {
		addError(error.error);
	}
};
