<svelte:options immutable />

<script lang="ts">
	import { posts } from "$lib/stores";
	import Loading from "../loading";
	import StatButton from "./stat-button.svelte";

	export let thread = false;
	export let id: number;
	export let onIntersection: null | ((id: number) => Promise<void>) = null;

	let loading = false;

	$: post = $posts.elements[id];

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

	const getDate = (iso: string) => {
		const date = new Date(`${iso}Z`);
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
</script>

<div use:last={onIntersection} class:post={!thread} on:keydown role="button" tabindex="0">
	<div class="meta">
		<span class="author">@<a href={`/${post.author}`}>{post.author}</a></span>
		<span class="date">{getDate(post.date)}</span>
	</div>

	{post.content}

	{#if !thread}
		<div class="stats">
			<StatButton icon="favorite-border">0</StatButton>

			<StatButton icon="chat">0</StatButton>
		</div>
	{/if}
</div>

{#if loading}
	<div class="loading">
		<Loading />
	</div>
{/if}

<style lang="scss">
	@use "$lib/commons/hover";
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

		@include hover.hover(0.03);
	}

	.meta {
		margin-bottom: 0.5rem;
	}

	.author {
		font-weight: bold;
		color: theme.$colorPrimary;
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
