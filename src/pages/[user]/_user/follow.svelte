<script lang="ts">
	import Button from "$lib/commons/components/button";
	import Fade from "$lib/commons/components/fade";
	import { post } from "$lib/commons/utils/fetch";
	import { invalidateUsers, store } from "$lib/stores.svelte";
	import { data } from "./load";

	type Props = { currentUser: string };

	let { currentUser } = $props<Props>();

	let invalidateLoading = $state(false);

	const handleFollowClick = async () => {
		if (!data.response?.user) {
			return;
		}

		invalidateLoading = true;
		await post("/api/follow", { id: data.response.user.id });
		await invalidateUsers(data.response.user.name);
		invalidateLoading = false;
	};
</script>

{#if data.response?.user}
	{@const updatedUser = store.users[data.response.user.id]}

	{#if data.response.user.id !== currentUser}
		<Fade>
			<div class="button">
				<Button
					loading={invalidateLoading}
					variant="contained"
					size="sm"
					color="neutral"
					disableUpperCase
					onclick={handleFollowClick}
				>
					{updatedUser.followed ? "Dejar de seguir" : "Seguir"}
				</Button>
			</div>
		</Fade>
	{/if}
{/if}

<style lang="scss">
	.button {
		position: absolute;
		right: 1rem;
	}
</style>
