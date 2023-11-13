<script lang="ts">
	import Fade from "$lib/commons/components/fade";
	import Loading from "$lib/components/loading";
	import { fly } from "svelte/transition";
	import { loading } from "./load";
	import { tab } from "./store";
	import Tab from "./tab.svelte";
</script>

{#await loading}
	<Loading />
{:then}
	<Fade>
		{#key $tab.active}
			<div
				in:fly={{ x: `${100 * $tab.direction}%`, opacity: 1 }}
				out:fly={{ x: `${-100 * $tab.direction}%`, opacity: 1 }}
			>
				<Tab active={$tab.active} />
			</div>
		{/key}
	</Fade>
{/await}
