<svelte:options immutable />

<script lang="ts">
	import { post } from "$lib/commons/utils/fetch";
	import { store } from "$lib/stores.svelte";
	import Avatar from "../avatar";
	import Loading from "../loading";
	import Replacer from "../replacer";
	import StatButton from "./stat-button.svelte";

	type Props = {
		thread?: boolean;
		id: number;
		onintersection?: (id: number) => Promise<void>;
	};

	let { thread, id, onintersection } = $props<Props>();

	let loading = $state(false);
	let currentPost = $derived(store.posts.elements[id]);
	let transition = $state(false);

	const last = (node: HTMLElement, callback: typeof onintersection) => {
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

	const toggleLike = () => {
		store.posts.elements[id] = {
			...currentPost,
			likes: currentPost.likes + (currentPost.liked ? -1 : 1),
			liked: !currentPost.liked,
		};
		store.posts = { ...store.posts };
	};

	const handleClick = (event: Event) => {
		event.stopPropagation();
		toggleLike();
		post("/api/post/like", { post: id }).catch(toggleLike);
	};
</script>

<div use:last={onintersection} class="post">
	<div class:transition><Avatar initial={currentPost.author[0]} /></div>

	<div>
		<div class="meta">
			<span class="author">
				@<a onclick={() => (transition = true)} href={`/${currentPost.author}`}>
					{currentPost.author}
				</a>
			</span>
			<span class="date">{getDate(currentPost.date)}</span>
		</div>

		<Replacer content={currentPost.content} withLink />

		{#if !thread}
			<div class="stats">
				<span class:liked={currentPost.liked}>
					<StatButton
						icon={currentPost.liked ? "favorite" : "favorite-border"}
						onclick={handleClick}
					>
						{currentPost.likes}
					</StatButton>
				</span>

				<StatButton icon="chat">0</StatButton>
			</div>
		{/if}
	</div>
</div>

{#if loading}
	<div class="loading">
		<Loading />
	</div>
{/if}

<style lang="scss">
	@use "$lib/commons/hover";
	@use "$lib/commons/theme";

	.liked {
		color: rgb(255, 30, 30);
	}

	.loading {
		padding: 2rem;
	}

	a {
		color: inherit;
		text-decoration: none;

		&:hover {
			text-decoration: underline;
		}
	}

	.transition {
		view-transition-name: avatar;
	}

	.post {
		@extend %root;
		@include hover.hover(0.03);

		border-bottom: 1px solid theme.$colorNeutralDark;
		padding: 0.75rem 0.75rem 0;
		cursor: pointer;
		display: grid;
		grid-template-columns: 40px 1fr;
		gap: 0.75rem;
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
