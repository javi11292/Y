<script lang="ts">
	import Input from "$lib/commons/components/input";
	import type { ComponentProps } from "svelte";

	export let title: string;
	export let fields: ({ name: string } & ComponentProps<Input>)[];
	export let values: Record<string, string> = {};

	let inputs: Record<string, HTMLInputElement> = {};
</script>

<div class="form">
	<div class="title">{title}</div>

	{#each fields as { name, ...field }}
		<Input bind:input={inputs[name]} bind:value={values[name]} {...field} />
	{/each}

	<slot />
</div>

<style lang="scss">
	.form {
		display: grid;
		gap: 0.5rem;
		padding: 1rem;
		max-width: 640px;
	}

	.title {
		font-size: 2rem;
	}
</style>
