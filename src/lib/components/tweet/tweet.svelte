<svelte:options immutable />

<script lang="ts">
	import { page } from "$app/stores";
	import Icon from "$lib/commons/components/icon";
	import { post } from "$lib/commons/utils/fetch";
	import type { PostId } from "$lib/models/post";
	import Loading from "../loading";

	export let tweet: PostId;
	export let onIntersection: null | ((id: string) => Promise<void>);

	let loading = false;

	const last = (node: HTMLElement) => {
		if (!onIntersection) {
			return;
		}

		let callback = onIntersection;

		const observer = new IntersectionObserver(async ([{ isIntersecting }]) => {
			if (isIntersecting) {
				loading = true;
				await callback(tweet._id);
				observer.disconnect();
				loading = false;
			}
		});

		observer.observe(node);
		return {
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
		tweet = { ...tweet, likes: tweet.likes + (like ? -1 : 1) };

		if (!like) {
			$page.data.likedPosts.add(tweet._id);
		} else {
			$page.data.likedPosts.delete(tweet._id);
		}
	};

	const handleLikeClick = () => {
		toggleLike();
		post("/api/post/like", { id: tweet._id }).catch(toggleLike);
	};
</script>

<div use:last class="post">
	<div class="meta">
		<a class="author" href={`/@${tweet.author}`}>@{tweet.author}</a>
		<span class="date">{getDate(tweet.date)}</span>
	</div>
	{tweet.content}
	<div class="stats">
		<button class="button" on:click={handleLikeClick}>
			<span class="icon">
				<Icon icon={like ? "favorite" : "favorite-border"} />
			</span>
			{#key tweet.likes}
				<div class="value">
					{tweet.likes}
				</div>
			{/key}
		</button>
	</div>
</div>

{#if loading}
	<div class="loading">
		<Loading />
	</div>
{/if}

<style lang="scss">
	@use "$lib/commons/theme";
	@use "$lib/commons/classes";

	.loading {
		padding: 2rem;
	}

	a {
		color: theme.$colorPrimary;
		text-decoration: none;
	}

	.post {
		border-bottom: 1px solid theme.$colorNeutralDark;
		padding: 1rem 1rem 0;
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
		display: flex;
	}

	.value {
		transition: all;
		transition-duration: 200ms;
	}

	.icon {
		@extend %root;
		border-radius: 50%;
		overflow: hidden;
		padding: 0.5rem;
		margin-left: -0.5rem;
		font-size: 1.5rem;
	}

	.button {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		cursor: pointer;

		@media (hover: hover) {
			&:hover {
				color: theme.$colorPrimary;

				.icon {
					@include classes.hover;
				}
			}
		}

		&:active {
			color: theme.$colorPrimary;

			.icon {
				@include classes.active;

				scale: 95%;
			}
		}
	}
</style>
