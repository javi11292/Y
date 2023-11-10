<script lang="ts">
	import type { Post } from "$lib/database";
	import { setPosts } from "$lib/stores";
	import { fly } from "svelte/transition";
	import { active, direction } from "./constants";
	import Tab from "./tab.svelte";

	export let posts: Post[];

	setPosts(posts);
</script>

{#key $active}
	<div
		in:fly={{ x: `${100 * $direction}%`, opacity: 1 }}
		out:fly={{ x: `${-100 * $direction}%`, opacity: 1 }}
	>
		<Tab active={$active} />
	</div>
{/key}
