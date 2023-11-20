<script lang="ts">
	import Button from "$lib/commons/components/button";
	import { tab, tabs } from "./store.svelte";

	const handleClick = async (nextTab: number) => {
		if (tab.active === nextTab) {
			return;
		}

		const { finished } = document.startViewTransition(() => {
			const direction = (tab.active < nextTab ? 1 : -1).toString();
			document.documentElement.style.setProperty("--direction", direction);
			tab.active = nextTab;
		});

		await finished;

		document.documentElement.style.removeProperty("--direction");
	};
</script>

<Button disableBorder disableActive disableUpperCase onclick={() => handleClick(tabs.tab1)}>
	Para ti
	{#if tab.active === tabs.tab1}
		<div class="selectedTab" />
	{/if}
</Button>

<Button disableBorder disableActive disableUpperCase onclick={() => handleClick(tabs.tab2)}>
	Siguiendo
	{#if tab.active === tabs.tab2}
		<div class="selectedTab" />
	{/if}
</Button>

<style lang="scss">
	@use "$lib/commons/theme";

	.selectedTab {
		view-transition-name: selectedTab;
		position: absolute;
		bottom: 0;
		translate: -50%;
		left: 50%;
		width: 25%;
		border-bottom: 4px solid theme.$colorPrimary;
		border-radius: 2px;
	}
</style>
