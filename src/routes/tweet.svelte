<svelte:options immutable />

<script lang="ts">
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
		if (!iso) {
			return "";
		}

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
</div>

<style lang="scss">
	@use "$lib/commons/theme";

	.post {
		border-bottom: 1px solid theme.$colorNeutralDark;
		padding: 1rem;
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
</style>
