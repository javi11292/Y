<script lang="ts">
	import LoadingIcon from "$lib/commons/components/loading-icon";
	import { onMount } from "svelte";
	import { fade } from "svelte/transition";

	let render = false;

	onMount(() => (render = true));
</script>

{#if render}
	<div in:fade={{ duration: 1000 }} class="loading">
		<LoadingIcon />
	</div>
{:else}
	&nbsp;
{/if}

<style lang="scss">
	.loading {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
	}
</style>
