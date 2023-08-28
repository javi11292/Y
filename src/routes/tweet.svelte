<svelte:options immutable />

<script lang="ts">
	import Icon from "$lib/commons/components/icon";
	import type { Post } from "$lib/models/post";

	export let observer: IntersectionObserver;
	export let post: Post;
	export let observe: boolean;

	const last = (node: HTMLElement) => {
		if (!observe) {
			return {};
		}

		observer.observe(node);

		return {
			destroy: () => observer.unobserve(node),
		};
	};

	const getDate = (iso: Date) => {
		const date = new Date(iso);
		let diff = Math.floor((Date.now() - date.getTime()) / 1000);

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

<div use:last class="post">
	<div class="meta">
		<span class="author">@{post.author}</span>
		<span class="date">{getDate(post.date)}</span>
	</div>
	{post.content}
	<div class="stats">
		<span class="button">
			<span class="icon">
				<Icon icon="favoriteBorder" />
			</span>
			<span class="value">
				{post.likes}
			</span>
		</span>
	</div>
</div>

<style lang="scss">
	@use "$lib/commons/theme";
	@use "$lib/commons/classes";

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
			}
		}
	}
</style>
