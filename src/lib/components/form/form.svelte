<script lang="ts">
	import Button from "$lib/commons/components/button";
	import Input from "$lib/commons/components/input";
	import { addError } from "$lib/commons/components/snackbar";
	import { NetworkError } from "$lib/commons/utils/fetch";
	import type { ComponentProps } from "svelte";

	export let title: string;
	export let fields: ({ name: string } & ComponentProps<Input>)[];
	export let onSubmit: (values: Record<string, string>) => Promise<void>;

	let values: Record<string, string> = {};
	let elements: HTMLInputElement[] = [];
	let loading = false;

	const handleClick = async () => {
		loading = true;

		try {
			await onSubmit(values);
		} catch (error) {
			if (error instanceof NetworkError) {
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

<div class="form">
	<div class="title">{title}</div>

	{#each fields as { name, ...field }, index}
		<Input
			bind:element={elements[index]}
			bind:value={values[name]}
			on:keypress={handleKeyPress(index + 1)}
			{...field}
		/>
	{/each}

	<Button bind:element={elements[elements.length]} {loading} on:click={handleClick}>
		Continuar
	</Button>

	<div class="link">
		<slot />
	</div>
</div>

<style lang="scss">
	@use "src/lib/commons/theme";

	.form {
		display: grid;
		gap: 0.5rem;
		padding: 1rem;
	}

	.title {
		font-size: 2rem;
	}

	.link {
		margin-top: 2rem;
		color: theme.$colorNeutral;

		:global(a) {
			text-decoration: none;

			&:hover {
				text-decoration: underline;
			}
		}
	}
</style>
