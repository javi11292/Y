<script lang="ts">
	import { get } from "$lib/commons/utils/fetch";
	import PostComponent from "$lib/components/post";
	import type { Post } from "$lib/database/post";
	import { posts } from "$lib/stores";
	import { tabs } from "./constants";

	export let active: number;

	let filteredPosts: number[] = [];

	$: {
		if (active === tabs.tab1) {
			filteredPosts = $posts.all;
		} else {
			filteredPosts = $posts.following;
		}
	}

	const handleIntersection = async (id: number) => {
		const api = active === tabs.tab1 ? "all" : "following";
		const response = (await get(`/api/post/${api}/${id}`)) as Post[];

		response.forEach((post) => {
			$posts.elements[post.id] = post;
			$posts[api].push(post.id);
		});

		$posts = { ...$posts };
	};
</script>

{#each filteredPosts as post, index}
	<PostComponent
		id={post}
		onIntersection={index === filteredPosts.length - 1 ? handleIntersection : null}
	/>
{/each}
