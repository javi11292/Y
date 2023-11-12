<script lang="ts">
	import Button from "$lib/commons/components/button";
	import { post } from "$lib/commons/utils/fetch";
	import type { User } from "$lib/database";
	import { invalidateUsers, users } from "$lib/stores";
	import { addUser } from "./load";

	let loading = false;

	export let user: User;
	export let currentUser: string;

	const handleFollowClick = async () => {
		loading = true;
		await post("/api/follow", { id: user.id });
		await invalidateUsers(user.name);
		loading = false;
	};

	addUser($users, user);

	$: udpatedUser = $users[user.id];
</script>

{#if user.id !== currentUser}
	<Button
		{loading}
		variant="contained"
		size="sm"
		color="neutral"
		disableUpperCase
		on:click={handleFollowClick}
	>
		{udpatedUser.isFollowing ? "Dejar de seguir" : "Seguir"}
	</Button>
{/if}
