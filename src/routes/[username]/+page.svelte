<script lang="ts">
	import { invalidate } from "$app/navigation";
	import Button from "$lib/commons/components/button";
	import { post } from "$lib/commons/utils/fetch";

	export let data;

	$: user = data.user;
	let loading = false;

	const handleFollowClick = async () => {
		loading = true;
		await post("/api/follow", { id: user.username });
		await Promise.all([invalidate("user"), invalidate("user:id")]);
		loading = false;
	};
</script>

<div class="container">
	<div class="buttons">
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
	@{user.username}

	<div class="followers">
		{user.following.length} <span>Siguiendo</span>
		{user.followers} <span>Seguidores</span>
	</div>
</div>

<style lang="scss">
	@use "$lib/commons/theme";

	.container {
		padding: 1rem;
	}

	.buttons {
		display: flex;
		justify-content: end;
	}

	.followers {
		margin-top: 1rem;

		span {
			margin-right: 1rem;
			color: theme.$colorNeutral;
		}
	}
</style>
