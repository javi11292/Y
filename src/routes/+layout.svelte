<script lang="ts">
	import Snackbar from "$lib/commons/components/snackbar";
	import "$lib/commons/utils/layout";
	import { fly } from "svelte/transition";

	export let data;
</script>

{#key data.pathname}
	<div class="layout" in:fly={{ x: "100%" }} out:fly={{ x: "-100%" }}>
		<div class="scroll">
			<slot />
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
		overflow-x: scroll;
		height: 100%;

		> :global(*) {
			@extend %view;
		}
	}
</style>
