<script lang="ts">
	import Loading from "$lib/components/loading";
	import Post from "$lib/components/post";
	import Tweet from "$lib/components/tweet";
	import type { PostId } from "$lib/models/post";

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
	<div class="loading">
		<Loading />
	</div>
{/if}

<style lang="scss">
	.loading {
		padding: 2rem;
	}
</style>
