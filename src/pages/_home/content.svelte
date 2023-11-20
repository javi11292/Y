<script lang="ts">
	import Fade from "$lib/commons/components/fade";
	import Loading from "$lib/components/loading";
	import { loading } from "./load";
	import { tab } from "./store.svelte";
	import Tab from "./tab.svelte";
</script>

{#if $loading}
	<Loading />
{:else}
	<Fade>
		{#key tab.active}
			<div class="tabContent">
				<Tab active={tab.active} />
			</div>
		{/key}
	</Fade>
{/if}

<style lang="scss">
	.tabContent {
		view-transition-name: tabContent;
	}
</style>
