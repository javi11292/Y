<script lang="ts">
	import Button from "$lib/commons/components/button";
	import Input from "$lib/commons/components/input";
	import { addError } from "$lib/commons/components/snackbar";
	import { post } from "$lib/commons/utils/fetch";
	import type { ComponentProps } from "svelte";

	export let fields: ({ name: string } & ComponentProps<Input>)[];
	export let api: "login" | "register";

	let values: Record<string, string> = {};
	let elements: HTMLInputElement[] = [];
	let loading = false;

	const handleClick = async () => {
		loading = true;

		try {
			if (api === "register" && values.password !== values.confirmPassword) {
				throw new Error("Las contraseñas no coinciden");
			}

			await post(`/api/${api}`, { username: values.username, password: values.password });
		} catch (error) {
			if (error instanceof Error) {
				addError(error.message);
			}
		}

		loading = false;
	};

	const handleKeyPress = (index: number) => (event: KeyboardEvent) => {
		if (event.key !== "Enter") {
			return;
		}

		if (index === elements.length - 1) {
			elements[index].click();
		}

		elements[index].focus();
	};
</script>

{#each fields as { name, ...field }, index}
	<Input
		bind:element={elements[index]}
		bind:value={values[name]}
		on:keypress={handleKeyPress(index + 1)}
		{...field}
	/>
{/each}

<Button bind:element={elements[elements.length]} {loading} on:click={handleClick}>Continuar</Button>
