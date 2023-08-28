<script lang="ts">
	import { browser } from "$app/environment";
	import { get } from "$lib/commons/utils/fetch";
	import PostComponent from "$lib/components/post";
	import type { PostId } from "$lib/models/post";

	export let data;

	let posts: PostId[] = [];
	let lastId = "";

	$: {
		data.streamed.posts.then((value) => (posts = value));
	}

	const observer = (browser &&
		new IntersectionObserver(
			async ([{ isIntersecting }]) => {
				const lastPost = posts[posts.length - 1];

				if (isIntersecting && lastPost && lastId !== lastPost._id) {
					posts.push(...((await get(`/api/post/${lastPost._id}`)) as PostId[]));
					posts = posts;
					lastId = lastPost._id;
				}
			},
			{ threshold: 1 }
		)) as IntersectionObserver;

	type Last = (node: HTMLElement, args: { index: number; posts: unknown[] }) => void;

	const last: Last = (node, { index, posts }) => {
		if (index < posts.length - 1) {
			return;
		}

		observer.observe(node);

		return () => observer.unobserve(node);
	};
</script>

<PostComponent />

{#each posts as post, index}
	<div use:last={{ index, posts }} class="post">
		<div class="author">@{post.author}</div>
		{post.content}
	</div>
{/each}

<style lang="scss">
	@use "$lib/commons/theme";

	.post {
		border-bottom: 1px solid theme.$colorNeutralDark;
		padding: 1rem;
	}

	.author {
		font-weight: bold;
		margin-bottom: 0.5rem;
	}
</style>
