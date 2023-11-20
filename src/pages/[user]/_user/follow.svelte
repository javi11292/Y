<script lang="ts">
	import Button from "$lib/commons/components/button";
	import Fade from "$lib/commons/components/fade";
	import { post } from "$lib/commons/utils/fetch";
	import { invalidateUsers, users } from "$lib/stores";
	import { data } from "./load";

	type Props = { currentUser: string };

	let { currentUser } = $props<Props>();

	let invalidateLoading = $state(false);

	const handleFollowClick = async () => {
		if (!$data?.user) {
			return;
		}

		invalidateLoading = true;
		await post("/api/follow", { id: $data.user.id });
		await invalidateUsers($data.user.name);
		invalidateLoading = false;
	};
</script>

{#if $data?.user}
	{@const updatedUser = $users[$data.user.id] || $data.user}

	{#if $data.user.id !== currentUser}
		<Fade>
			<div class="button">
				<Button
					loading={invalidateLoading}
					variant="contained"
					size="sm"
					color="neutral"
					disableUpperCase
					on:click={handleFollowClick}
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
