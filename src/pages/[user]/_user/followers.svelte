<script lang="ts">
	import type { User } from "$lib/database";
	import { users } from "$lib/stores";
	import { addUser } from "./load";

	export let user: User;

	addUser($users, user);

	$: udpatedUser = $users[user.id];
</script>

{udpatedUser.following[0].count}
<span>Siguiendo</span>
{udpatedUser.followers[0].count}
<span>Seguidores</span>
