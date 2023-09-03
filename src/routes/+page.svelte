<script lang="ts">
	import Button from "$lib/commons/components/button";
	import Header from "$lib/components/header";
	import Post from "$lib/components/post";
	import { fly } from "svelte/transition";
	import Tab1 from "./tab1.svelte";

	enum tabs {
		tab1,
		tab2,
	}

	const handleClick = (tab: number) => {
		if (active < tab) {
			direction = 1;
		} else {
			direction = -1;
		}

		active = tab;
	};

	let active = tabs.tab1;
	let direction = 1;
</script>

<Post />

<div class="container">
	<Header>
		<div class="tabs">
			<Button disableBorder disableActive disableUpperCase on:click={() => handleClick(tabs.tab1)}>
				Para ti
			</Button>
			<Button disableBorder disableActive disableUpperCase on:click={() => handleClick(tabs.tab2)}>
				Siguiendo
			</Button>
		</div>
	</Header>

	<div class="tab">
		{#key active}
			<div
				in:fly={{ x: `${100 * direction}%`, opacity: 1 }}
				out:fly={{ x: `${-100 * direction}%`, opacity: 1 }}
			>
				<Tab1 />
			</div>
		{/key}
	</div>
</div>

<style lang="scss">
	@use "$lib/commons/theme";

	.container {
		position: relative;
		overflow: hidden;
	}

	.tabs {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		border-bottom: 1px solid theme.$colorNeutralDark;
	}

	.tab {
		display: grid;
		grid-template-areas: "content";

		& > * {
			grid-area: content;
		}
	}
</style>
