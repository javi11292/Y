<script lang="ts">
	import { get } from "$lib/commons/utils/fetch";
	import Post from "$lib/components/post";
	import Tweet from "$lib/components/tweet";
	import type { PostId } from "$lib/models/post";

	export let data;

	let tweets: PostId[] = [];

	$: tweets = data.posts;

	const handleIntersection = async (id: string) => {
		const response = (await get(`/api/post/all/${id}`)) as PostId[];
		tweets.push(...response);
		tweets = tweets;
	};
</script>

<Post />

{#each tweets as tweet, index}
	<Tweet bind:tweet onIntersection={index === tweets.length - 1 ? handleIntersection : null} />
{/each}
