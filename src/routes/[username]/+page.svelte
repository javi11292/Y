<script lang="ts">
	import { browser } from "$app/environment";
	import { invalidate } from "$app/navigation";
	import Button from "$lib/commons/components/button";
	import { get, post } from "$lib/commons/utils/fetch";
	import Back from "$lib/components/back";
	import Header from "$lib/components/header";
	import Loading from "$lib/components/loading";
	import Post from "$lib/components/post";
	import Tweet from "$lib/components/tweet";
	import type { PostId } from "$lib/models/post";
	import type { User } from "$lib/models/user";
	import { posts } from "$lib/stores";
	import { fade } from "svelte/transition";
	import { bustUserCache } from "./cache";

	export let data;

	let loading = false;
	let user: User;
	let tweets: PostId[] = [];

	const updatePosts = () => {
		if (browser) {
			tweets.forEach((tweet) => {
				$posts.elements[tweet._id] = $posts.elements[tweet._id] || tweet;
			});

			$posts = { ...$posts };
		}
	};

	$: data.streamed.user.then((value) => (user = value));
	$: data.streamed.posts.then((value) => {
		tweets = value;
		updatePosts();
	});

	const handleFollowClick = async () => {
		loading = true;
		bustUserCache(user.username);
		await post("/api/follow", { id: user.username });
		await Promise.all([invalidate("user"), invalidate("user:id")]);
		loading = false;
	};

	const handleIntersection = async (id: string) => {
		const response = (await get(`/api/post/user/${user.username}/${id}`)) as PostId[];
		response.forEach((tweet) => {
			$posts.elements[tweet._id] = tweet;
		});
		tweets = [...tweets, ...response];
	};
</script>

<Post />

{#if user}
	<div in:fade class="container">
		<Header>
			<div class="buttons">
				<Back />
				<div>
					{#if user.username !== data.username}
						<Button
							{loading}
							variant="contained"
							size="sm"
							color="neutral"
							disableUpperCase
							on:click={handleFollowClick}
						>
							{data.following.has(user.username) ? "Dejar de seguir" : "Seguir"}
						</Button>
					{/if}
				</div>
			</div>
		</Header>

		<div class="content">
			@{user.username}

			<div class="followers">
				{user.following.length} <span>Siguiendo</span>
				{user.followers} <span>Seguidores</span>
			</div>
		</div>

		<div><hr /></div>

		{#await data.streamed.posts}
			<Loading />
		{:then}
			{#each tweets as tweet, index}
				<Tweet
					id={tweet._id}
					onIntersection={index === tweets.length - 1 ? handleIntersection : null}
				/>
			{/each}
		{/await}
	</div>
{:else}
	<Loading />
{/if}

<style lang="scss">
	@use "$lib/commons/theme";

	hr {
		border-color: theme.$colorNeutralDark;
	}

	.container {
		display: flex;
		flex-direction: column;
		min-height: 100%;

		> :global(:last-child) {
			flex: 1;
		}
	}

	.content {
		padding: 0 1rem 1rem;
	}

	.buttons {
		display: flex;
		justify-content: space-between;
		align-items: start;
		padding: 1rem;

		> :global(:nth-child(1)) {
			margin: -0.5rem;
		}
	}

	.followers {
		margin-top: 1rem;

		span {
			margin-right: 1rem;
			color: theme.$colorNeutral;
		}
	}
</style>
