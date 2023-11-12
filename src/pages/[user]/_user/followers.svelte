<script lang="ts">
	import type { User } from "$lib/database";
	import { users } from "$lib/stores";

	export let user: User;

	if (!$users[user.id]) {
		$users[user.id] = user;
	}

	$: udpatedUser = $users[user.id];
</script>

{udpatedUser.following[0].count}
<span>Siguiendo</span>
{udpatedUser.followers[0].count}
<span>Seguidores</span>
