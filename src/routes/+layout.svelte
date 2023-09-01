<script lang="ts">
	import Snackbar from "$lib/commons/components/snackbar";
	import "$lib/commons/utils/layout";
	import { scroll } from "$lib/stores";
	import { fly } from "svelte/transition";

	export let data;

	let style: string | undefined;

	$: {
		if (!$scroll) {
			const scrollbarWidth = window.innerWidth - document.body.clientWidth;
			style = `--scrollbarWidth: ${scrollbarWidth}px`;
		} else {
			style = undefined;
		}
	}
</script>

{#key data.pathname}
	<div class="layout" in:fly={{ x: "100%" }} out:fly={{ x: "-100%" }} {style}>
		<div class="scroll" class:noScroll={!$scroll}>
			<slot />
			<div />
		</div>
	</div>
{/key}

<Snackbar />

<style lang="scss">
	%view {
		box-sizing: border-box;
		position: relative;
		left: 50%;
		translate: -50%;
		max-width: 640px;
	}

	.layout {
		position: absolute;
		width: 100%;
		height: 100%;

		> :global(:not(.scroll)) {
			@extend %view;
		}
	}

	.noScroll {
		overflow: hidden;
	}

	.scroll {
		scrollbar-gutter: stable;
		overflow-y: scroll;
		height: 100%;

		> :global(*) {
			@extend %view;
		}
	}
</style>
