<script lang="ts">
	import { invalidate } from "$app/navigation";
	import Button from "$lib/commons/components/button";
	import { post } from "$lib/commons/utils/fetch";
	import Back from "$lib/components/back";
	import type { User } from "$lib/models/user";
	import { bustCache } from "./cache";

	export let data;

	let user: User;

	$: data.streamed.user.then((value) => (user = value));
	let loading = false;

	const handleFollowClick = async () => {
		loading = true;
		bustCache(user.username);
		await post("/api/follow", { id: user.username });
		await Promise.all([invalidate("user"), invalidate("user:id")]);
		loading = false;
	};
</script>

{#if user}
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

	<div class="container">
		@{user.username}

		<div class="followers">
			{user.following.length} <span>Siguiendo</span>
			{user.followers} <span>Seguidores</span>
		</div>
	</div>
{/if}

<style lang="scss">
	@use "$lib/commons/theme";

	.container {
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
