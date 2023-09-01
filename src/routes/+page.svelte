<script lang="ts">
	import LoadingIcon from "$lib/commons/components/loading-icon";
	import Post from "$lib/components/post";
	import Tweet from "$lib/components/tweet";
	import type { PostId } from "$lib/models/post";
	import { fade } from "svelte/transition";

	export let data;

	let tweets: PostId[] = [];
	let loading = false;

	$: tweets = data.posts;

	const handleIntersection = async (response: Promise<PostId[]>) => {
		loading = true;
		tweets.push(...(await response));
		tweets = tweets;
		loading = false;
	};
</script>

<Post />

{#each tweets as tweet, index}
	<Tweet {tweet} onIntersection={index === tweets.length - 1 ? handleIntersection : null} />
{/each}

{#if loading}
	<div in:fade class="loading">
		<LoadingIcon />
	</div>
{/if}

<style lang="scss">
	.loading {
		display: flex;
		justify-content: center;
		padding: 2rem;
	}
</style>
