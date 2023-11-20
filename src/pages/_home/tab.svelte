<script lang="ts">
	import { get } from "$lib/commons/utils/fetch";
	import PostComponent from "$lib/components/post";
	import type { Post } from "$lib/database";
	import { posts } from "$lib/stores";
	import { tabs } from "./store.svelte";

	type Props = {
		active: number;
	};

	let { active } = $props<Props>();

	let filteredPosts: number[] = $derived(active === tabs.tab1 ? $posts.all : $posts.following);

	const handleIntersection = async (id: number) => {
		const api = active === tabs.tab1 ? "all" : "following";
		const response = await get<Post[]>(`/api/post/${api}/${id}`);

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
		onintersection={index === filteredPosts.length - 1 ? handleIntersection : undefined}
	/>
{/each}
