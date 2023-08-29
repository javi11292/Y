<script lang="ts">
	import { browser } from "$app/environment";
	import LoadingIcon from "$lib/commons/components/loading-icon";
	import { get } from "$lib/commons/utils/fetch";
	import Post from "$lib/components/post";
	import type { PostId } from "$lib/models/post";
	import { fade } from "svelte/transition";
	import Tweet from "./tweet.svelte";

	export let data;

	let posts: PostId[] = [];
	let lastId = "";
	let loading = false;

	$: {
		data.streamed.posts.then((value) => (posts = value));
	}

	const getNextPosts = async () => {
		const lastPost = posts[posts.length - 1];

		if (lastPost && lastId !== lastPost._id) {
			loading = true;
			posts.push(...((await get(`/api/post/${lastPost._id}`)) as PostId[]));
			posts = posts;
			lastId = lastPost._id;
			loading = false;
		}
	};

	const observer = (browser &&
		new IntersectionObserver(
			([{ isIntersecting }]) => {
				if (isIntersecting) {
					getNextPosts();
				}
			},
			{ threshold: 0.5 }
		)) as IntersectionObserver;
</script>

<Post />

{#each posts as post, index}
	<Tweet tweet={post} {observer} observe={index + 1 === posts.length} />
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
