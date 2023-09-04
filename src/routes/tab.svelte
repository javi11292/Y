<script lang="ts">
	import { page } from "$app/stores";
	import { get } from "$lib/commons/utils/fetch";
	import Tweet from "$lib/components/tweet";
	import type { PostId } from "$lib/models/post";
	import { tabs } from "./constants";

	export let active: number;

	let tweets: PostId[] = [];

	$: {
		if (active === tabs.tab1) {
			tweets = $page.data.posts;
		} else {
			tweets = $page.data.followingPosts;
		}
	}

	const handleIntersection = async (id: string) => {
		const api = active === tabs.tab1 ? "all" : "following";
		const response = (await get(`/api/post/${api}/${id}`)) as PostId[];
		tweets.push(...response);
		tweets = tweets;
	};
</script>

{#each tweets as tweet, index}
	<Tweet bind:tweet onIntersection={index === tweets.length - 1 ? handleIntersection : null} />
{/each}
