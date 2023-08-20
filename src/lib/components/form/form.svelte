<script lang="ts">
	import { invalidateAll } from "$app/navigation";
	import Button from "$lib/commons/components/button";
	import Input from "$lib/commons/components/input";
	import { showError } from "$lib/utils/message";
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
			invalidateAll();
		} catch (error) {
			showError(error);
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

	<div class="button">
		<Button bind:element={elements[elements.length]} {loading} on:click={handleClick}>
			Continuar
		</Button>
	</div>
</div>

<style lang="scss">
	.form {
		position: relative;
		left: 50%;
		translate: -50%;
		display: grid;
		gap: 0.5rem;
		padding: 1rem;
		max-width: 640px;
	}

	.title {
		font-size: 2rem;
	}

	.button {
		display: contents;
		text-align: center;
	}
</style>
