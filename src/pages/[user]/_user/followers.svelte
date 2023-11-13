<script lang="ts">
	import Fade from "$lib/commons/components/fade";
	import { users } from "$lib/stores";
	import { data } from "./load";
</script>

{#if $data?.user}
	{@const updatedUser = $users[$data.user.id]}

	<Fade>
		{updatedUser.following[0].count}
		<span>Siguiendo</span>
		{updatedUser.followers[0].count}
		<span>Seguidores</span>
	</Fade>
{:else}
	<span />
{/if}
