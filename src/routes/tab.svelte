<script lang="ts">
	import { get } from "$lib/commons/utils/fetch";
	import Tweet from "$lib/components/tweet";
	import type { PostId } from "$lib/models/post";
	import { posts } from "$lib/stores";
	import { tabs } from "./constants";

	export let active: number;

	let tweets: string[] = [];

	$: {
		if (active === tabs.tab1) {
			tweets = $posts.all;
		} else {
			tweets = $posts.following;
		}
	}

	const handleIntersection = async (id: string) => {
		const api = active === tabs.tab1 ? "all" : "following";
		const response = (await get(`/api/post/${api}/${id}`)) as PostId[];

		response.forEach((tweet) => {
			$posts.elements[tweet._id] = tweet;
			$posts[api].push(tweet._id);
		});

		$posts = { ...$posts };
	};
</script>

{#each tweets as tweet, index}
	<Tweet id={tweet} onIntersection={index === tweets.length - 1 ? handleIntersection : null} />
{/each}
