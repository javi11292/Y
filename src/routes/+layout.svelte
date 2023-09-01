<script lang="ts">
	import { browser } from "$app/environment";
	import Snackbar from "$lib/commons/components/snackbar";
	import "$lib/commons/utils/layout";
	import { scroll } from "$lib/stores";
	import { fly } from "svelte/transition";

	export let data;

	let transition = false;
	let measurer: Element;

	const setScrollbarWidth = (add: boolean) => {
		if (add) {
			const scrollbarWidth = window.innerWidth - measurer.clientWidth;
			document.documentElement.style.setProperty("--scrollbarWidth", `${scrollbarWidth}px`);
		} else {
			document.documentElement.style.removeProperty("--scrollbarWidth");
		}
	};

	$: {
		if (browser) {
			setScrollbarWidth(transition || !$scroll);
		}
	}
</script>

{#key data.pathname}
	<div
		class="layout"
		on:introstart={() => (transition = true)}
		on:introend={() => (transition = false)}
		in:fly={{ x: "100%" }}
		out:fly={{ x: "-100%" }}
	>
		<div class="scroll" class:noScroll={transition || !$scroll}>
			<slot />
			<div class="measurer" bind:this={measurer} />
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

	.scroll {
		scrollbar-gutter: stable;
		overflow-y: scroll;
		height: 100%;

		&.noScroll {
			overflow: hidden;
		}

		> :global(:not(.measurer)) {
			@extend %view;
		}
	}
</style>
