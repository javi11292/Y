<script lang="ts">
	import Fade from "$lib/commons/components/fade";
	import { store } from "$lib/stores.svelte";
	import { data } from "./load";
</script>

{#if data.response?.user}
	{@const updatedUser = store.users[data.response.user.id]}

	<Fade>
		{updatedUser.following}
		<span>Siguiendo</span>
		{updatedUser.followers}
		<span>Seguidores</span>
	</Fade>
{:else}
	<span />
{/if}
