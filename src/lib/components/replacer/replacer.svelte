<script lang="ts">
	export let content: string;
	export let withLink: boolean = false;

	let components: { type: "string" | "user"; value: string }[] = [];

	$: {
		components = [];
		const regex = /@(\w+)/g;

		let index = 0;
		let result: RegExpExecArray | null;

		while ((result = regex.exec(content))) {
			components.push({ type: "string", value: content.slice(index, result.index) });
			index = regex.lastIndex;

			components.push({ type: "user", value: result[1] });
		}

		components.push({ type: "string", value: content.slice(index) });
	}
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
