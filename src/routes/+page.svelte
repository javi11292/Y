<script lang="ts">
	import Button from "$lib/commons/components/button";
	import Header from "$lib/components/header";
	import Post from "$lib/components/post";
	import { crossfade, fly } from "svelte/transition";
	import { tabs } from "./constants";
	import Tab from "./tab.svelte";

	const handleClick = (tab: number) => {
		if (active < tab) {
			direction = 1;
		} else {
			direction = -1;
		}

		active = tab;
	};

	const key = { key: "indicator" };
	let active = tabs.tab1;
	let direction = 1;

	const [send, receive] = crossfade({ duration: 200 });
</script>

<Post />

<div class="container">
	<Header>
		<div class="tabs">
			<Button disableBorder disableActive disableUpperCase on:click={() => handleClick(tabs.tab1)}>
				Para ti
				{#if active === tabs.tab1}
					<div class="indicator" in:receive={key} out:send={key} />
				{/if}
			</Button>
			<Button disableBorder disableActive disableUpperCase on:click={() => handleClick(tabs.tab2)}>
				Siguiendo
				{#if active === tabs.tab2}
					<div class="indicator" in:receive={key} out:send={key} />
				{/if}
			</Button>
		</div>
	</Header>

	<div class="content">
		{#key active}
			<div
				in:fly={{ x: `${100 * direction}%`, opacity: 1 }}
				out:fly={{ x: `${-100 * direction}%`, opacity: 1 }}
			>
				<Tab {active} />
			</div>
		{/key}
	</div>
</div>

<style lang="scss">
	@use "$lib/commons/theme";

	.container {
		position: relative;
	}

	.tabs {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		border-bottom: 1px solid theme.$colorNeutralDark;
		position: relative;
	}

	.content {
		display: grid;
		grid-template-areas: "content";
		overflow: hidden;

		& > * {
			grid-area: content;
		}
	}

	.indicator {
		position: absolute;
		bottom: 0;
		translate: -50%;
		left: 50%;
		width: 30%;
		border-bottom: 5px solid theme.$colorPrimary;
	}
</style>
