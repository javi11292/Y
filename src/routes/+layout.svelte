<script lang="ts">
	import { browser } from "$app/environment";
	import Snackbar from "$lib/commons/components/snackbar";
	import "$lib/commons/utils/layout";
	import { posts as _posts, scroll } from "$lib/stores";
	import { fly } from "svelte/transition";

	export let data;

	let transition = false;

	const setScrollbarWidth = (node: Element) => {
		const observer = new ResizeObserver(() => {
			const scrollbarWidth = document.body.clientWidth - node.clientWidth;
			document.documentElement.style.setProperty("--scrollbarWidth", `${scrollbarWidth}px`);
		});

		observer.observe(node);
		return { destroy: () => observer.disconnect() };
	};

	const updatePosts = ({ posts }: typeof data) => {
		if (browser) {
			$_posts = {
				elements: { ...posts.elements, ...$_posts.elements },
				all: posts.all,
				following: posts.following,
			};
		}
	};

	$: updatePosts(data);

	$: {
		if (browser) {
			document.documentElement.style.setProperty(
				"--overflow",
				transition || !$scroll ? "hidden" : "auto"
			);
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
		<div class="scroll">
			<slot />
			<div class="measurer" use:setScrollbarWidth />
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
		height: 100%;
		overflow-y: var(--overflow);

		> :global(:not(.measurer)) {
			@extend %view;
		}
	}
</style>
