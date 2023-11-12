<script lang="ts">
	import Button from "$lib/commons/components/button";
	import { crossfade } from "svelte/transition";
	import { tab, tabs } from "./store";

	const handleClick = (tab: number) => {
		if ($tab.active < tab) {
			$tab.direction = 1;
		} else {
			$tab.direction = -1;
		}

		$tab.active = tab;
	};

	const key = { key: "indicator" };

	const [send, receive] = crossfade({ duration: 200 });
</script>

<Button disableBorder disableActive disableUpperCase on:click={() => handleClick(tabs.tab1)}>
	Para ti
	{#if $tab.active === tabs.tab1}
		<div class="indicator" in:receive={key} out:send={key} />
	{/if}
</Button>
<Button disableBorder disableActive disableUpperCase on:click={() => handleClick(tabs.tab2)}>
	Siguiendo
	{#if $tab.active === tabs.tab2}
		<div class="indicator" in:receive={key} out:send={key} />
	{/if}
</Button>

<style lang="scss">
	@use "src/lib/commons/theme";

	.indicator {
		position: absolute;
		bottom: 0;
		translate: -50%;
		left: 50%;
		width: 25%;
		border-bottom: 4px solid theme.$colorPrimary;
		border-radius: 2px;
	}
</style>
