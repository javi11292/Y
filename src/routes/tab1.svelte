<script lang="ts">
	import { page } from "$app/stores";
	import { get } from "$lib/commons/utils/fetch";
	import Tweet from "$lib/components/tweet";
	import type { PostId } from "$lib/models/post";

	let tweets: PostId[] = [];

	$: tweets = $page.data.posts;

	const handleIntersection = async (id: string) => {
		const response = (await get(`/api/post/all/${id}`)) as PostId[];
		tweets.push(...response);
		tweets = tweets;
	};
</script>

{#each tweets as tweet, index}
	<Tweet bind:tweet onIntersection={index === tweets.length - 1 ? handleIntersection : null} />
{/each}
