<script lang="ts">
	import { browser } from "$app/environment";
	import { get } from "$lib/commons/utils/fetch";
	import Post from "$lib/components/post";
	import type { PostId } from "$lib/models/post";
	import Tweet from "./tweet.svelte";

	export let data;

	let posts: PostId[] = [];
	let lastId = "";

	$: {
		data.streamed.posts.then((value) => (posts = value));
	}

	const getNextPosts = async () => {
		const lastPost = posts[posts.length - 1];

		if (lastPost && lastId !== lastPost._id) {
			posts.push(...((await get(`/api/post/${lastPost._id}`)) as PostId[]));
			posts = posts;
			lastId = lastPost._id;
		}
	};

	const observer = (browser &&
		new IntersectionObserver(
			([{ isIntersecting }]) => {
				if (isIntersecting) {
					getNextPosts();
				}
			},
			{ threshold: 1 }
		)) as IntersectionObserver;
</script>

<Post />

{#each posts as post, index}
	<Tweet {post} {observer} observe={index + 1 === posts.length} />
{/each}
