<script lang="ts">
	type Props = { content: string; withLink?: boolean };

	let { content, withLink } = $props<Props>();

	const getComponents = () => {
		let nextComponents: { type: "string" | "user"; value: string }[] = [];
		const regex = /@(\w+)/g;

		let index = 0;
		let result: RegExpExecArray | null;

		while ((result = regex.exec(content))) {
			nextComponents.push({ type: "string", value: content.slice(index, result.index) });
			index = regex.lastIndex;

			nextComponents.push({ type: "user", value: result[1] });
		}

		nextComponents.push({ type: "string", value: content.slice(index) });

		return nextComponents;
	};

	let components = $derived(getComponents());
</script>

{#each components as { type, value }}
	{#if type === "string"}
		{value}
	{:else}
		<span class="mention"
			>@<svelte:element this={withLink ? "a" : "span"} href={withLink ? `/${value}` : undefined}
				>{value}</svelte:element
			></span
		>
	{/if}
{/each}

<style lang="scss">
	a {
		color: inherit;
		text-decoration: none;

		&:hover {
			text-decoration: underline;
		}
	}

	.mention {
		font-weight: bold;
		color: rgb(165 165 255);
	}
</style>
