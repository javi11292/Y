<script lang="ts">
	import Button from "$lib/commons/components/button";
	import Input from "$lib/commons/components/input";
	import { addError } from "$lib/commons/components/snackbar";
	import { post } from "$lib/commons/utils/fetch";
	import { navigate } from "astro:transitions/client";
	import type { ComponentProps } from "svelte";
	import { createState } from "./fields.util.svelte";

	type Props = {
		fields: Record<string, { name: string } & ComponentProps<Input>>;
		api: "login" | "register";
	};

	let { fields, api } = $props<Props>();

	let loading = $state(false);

	const values = createState(
		Object.values(fields).reduce<Record<string, string>>((acc, { name }) => {
			acc[name] = "";

			return acc;
		}, {}),
	);

	const elements = createState<HTMLElement[]>(
		Array.from({ length: Object.keys(fields).length + 1 }),
	);

	const handleClick = async () => {
		loading = true;

		try {
			if (fields.confirmPassword && values.password !== values.confirmPassword) {
				throw new Error("Las contraseñas no coinciden");
			}

			await post(`/api/${api}`, values);
			navigate("/");
		} catch (error) {
			if (error instanceof Error) {
				addError(error.message);
			}
		}

		loading = false;
	};

	const handleKeypress = (index: number) => (event: KeyboardEvent) => {
		if (event.key !== "Enter") {
			return;
		}

		if (index === elements.length - 1) {
			elements[index].click();
		}

		elements[index].focus();
	};
</script>

{#each Object.values(fields) as { name, ...field }, index}
	<Input
		bind:element={elements[index]}
		bind:value={values[name]}
		onkeypress={handleKeypress(index + 1)}
		{...field}
	/>
{/each}

<Button bind:element={elements[elements.length - 1]} {loading} onclick={handleClick}
	>Continuar</Button
>
