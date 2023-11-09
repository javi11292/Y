<script lang="ts">
	import Button from "$lib/commons/components/button";
	import { crossfade } from "svelte/transition";
	import { active, direction, tabs } from "./constants";

	const handleClick = (tab: number) => {
		if ($active < tab) {
			$direction = 1;
		} else {
			$direction = -1;
		}

		$active = tab;
	};

	const key = { key: "indicator" };

	const [send, receive] = crossfade({ duration: 200 });
</script>

<Button disableBorder disableActive disableUpperCase on:click={() => handleClick(tabs.tab1)}>
	Para ti
	{#if $active === tabs.tab1}
		<div class="indicator" in:receive={key} out:send={key} />
	{/if}
</Button>
<Button disableBorder disableActive disableUpperCase on:click={() => handleClick(tabs.tab2)}>
	Siguiendo
	{#if $active === tabs.tab2}
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
		width: 30%;
		border-bottom: 5px solid theme.$colorPrimary;
	}
</style>
