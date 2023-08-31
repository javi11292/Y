<script lang="ts">
	import Button from "$lib/commons/components/button";

	export let data;

	$: user = data.user;
</script>

<div class="container">
	<div class="buttons">
		<Button variant="contained" size="sm" color="neutral" disableUpperCase>Seguir</Button>
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
