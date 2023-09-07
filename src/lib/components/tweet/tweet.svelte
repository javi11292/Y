<svelte:options immutable />

<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import { post } from "$lib/commons/utils/fetch";
	import { posts } from "$lib/stores";
	import Loading from "../loading";
	import StatButton from "./stat-button.svelte";

	export let thread = false;
	export let id: string;
	export let onIntersection: null | ((id: string) => Promise<void>) = null;

	let loading = false;

	$: tweet = $posts.elements[id];

	const last = (node: HTMLElement, callback: typeof onIntersection) => {
		const ref = { callback };

		const observer = new IntersectionObserver(async ([{ isIntersecting }]) => {
			if (isIntersecting && ref.callback) {
				loading = true;
				await ref.callback(id);
				observer.disconnect();
				loading = false;
			}
		});

		if (callback) {
			observer.observe(node);
		}

		return {
			update: (nextCallback: typeof callback) => {
				ref.callback = nextCallback;
				if (nextCallback) {
					observer.observe(node);
				} else {
					observer.disconnect();
				}
			},
			destroy: () => observer.disconnect(),
		};
	};

	const getDate = (iso: Date) => {
		const date = new Date(iso);
		let diff = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));

		if (diff < 60) {
			return `${diff}s`;
		}

		diff = Math.floor(diff / 60);

		if (diff < 60) {
			return `${diff}m`;
		}

		diff = Math.floor(diff / 60);

		if (diff < 24) {
			return `${diff}h`;
		}

		return date.toLocaleDateString(undefined, { day: "numeric", month: "short" });
	};

	$: like = $page.data.likedPosts.has(tweet._id);

	const toggleLike = () => {
		$posts.elements[id] = { ...tweet, likes: tweet.likes + (like ? -1 : 1) };
		$posts = { ...$posts };

		if (!like) {
			$page.data.likedPosts.add(tweet._id);
		} else {
			$page.data.likedPosts.delete(tweet._id);
		}
	};

	const handleLikeClick = (event: Event) => {
		event.stopPropagation();
		toggleLike();
		post("/api/post/like", { id }).catch(toggleLike);
	};

	const handleReplyClick = (event: Event) => {
		event.stopPropagation();
		goto("#post", { noScroll: true, state: { tweet } });
	};
</script>

<div
	use:last={onIntersection}
	class:post={!thread}
	on:keydown
	on:click={() => goto(`/post/${tweet._id}`)}
	role="button"
	tabindex="0"
>
	<div class="meta">
		<a class="author" href={`/@${tweet.author}`}>@{tweet.author}</a>
		<span class="date">{getDate(tweet.date)}</span>
	</div>
	{tweet.content}

	{#if !thread}
		<div class="stats">
			<StatButton on:click={handleLikeClick} icon={like ? "favorite" : "favorite-border"}>
				{tweet.likes}
			</StatButton>

			<StatButton on:click={handleReplyClick} icon="chat">
				{tweet.replies}
			</StatButton>
		</div>
	{/if}
</div>

{#if loading}
	<div class="loading">
		<Loading />
	</div>
{/if}

<style lang="scss">
	@use "$lib/commons/classes";
	@use "$lib/commons/theme";

	.loading {
		padding: 2rem;
	}

	a {
		color: theme.$colorPrimary;
		text-decoration: none;

		&:hover {
			text-decoration: underline;
		}
	}

	.post {
		@extend %root;
		border-bottom: 1px solid theme.$colorNeutralDark;
		padding: 1rem 1rem 0;
		cursor: pointer;

		@include classes.hover(0.03);
	}

	.meta {
		margin-bottom: 0.5rem;
	}

	.author {
		font-weight: bold;
	}

	.date {
		margin-left: 0.5rem;
		color: theme.$colorNeutral;
	}

	.stats {
		margin: 0.25rem 0;
		color: theme.$colorNeutral;
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		justify-items: start;
	}
</style>
