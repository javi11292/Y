<script lang="ts">
	import { fly } from "svelte/transition";
	import { active, direction } from "./constants";
</script>

{#key $active}
	<div
		in:fly={{ x: `${100 * $direction}%`, opacity: 1 }}
		out:fly={{ x: `${-100 * $direction}%`, opacity: 1 }}
	>
		{$active}
	</div>
{/key}
