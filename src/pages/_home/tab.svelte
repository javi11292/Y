<script lang="ts">
	import { get } from "$lib/commons/utils/fetch";
	import PostComponent from "$lib/components/post";
	import type { Post } from "$lib/database";
	import { store } from "$lib/stores.svelte";
	import { tabs } from "./store.svelte";

	type Props = {
		active: number;
	};

	let { active } = $props<Props>();

	let filteredPosts: number[] = $derived(
		active === tabs.tab1 ? store.posts.all : store.posts.following,
	);

	const handleIntersection = async (id: number) => {
		const api = active === tabs.tab1 ? "all" : "following";
		const response = await get<Post[]>(`/api/post/${api}/${id}`);

		response.forEach((post) => {
			store.posts.elements[post.id] = post;
			store.posts[api].push(post.id);
		});

		store.posts = { ...store.posts };
	};
</script>

{#each filteredPosts as post, index}
	<PostComponent
		id={post}
		onintersection={index === filteredPosts.length - 1 ? handleIntersection : undefined}
	/>
{/each}
