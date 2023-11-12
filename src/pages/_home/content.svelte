<script lang="ts">
	import type { Post } from "$lib/database";
	import { loadPosts } from "$lib/stores";
	import { fly } from "svelte/transition";
	import { active, direction } from "./store";
	import Tab from "./tab.svelte";

	export let posts: Post[];
	export let following: Post[];

	loadPosts(posts, following);
</script>

{#key $active}
	<div
		in:fly={{ x: `${100 * $direction}%`, opacity: 1 }}
		out:fly={{ x: `${-100 * $direction}%`, opacity: 1 }}
	>
		<Tab active={$active} />
	</div>
{/key}
