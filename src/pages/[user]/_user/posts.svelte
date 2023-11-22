<script lang="ts">
	import Fade from "$lib/commons/components/fade";
	import Loading from "$lib/components/loading";
	import PostComponent from "$lib/components/post";
	import { store } from "$lib/stores.svelte";
	import { data } from "./load";

	type Props = { name: string };

	let { name } = $props<Props>();
</script>

{#if data.loading}
	<Loading />
{:else if data.response?.user}
	<Fade>
		<hr />

		{#each store.users[data.response.user.id].posts as post}
			<PostComponent id={post} />
		{/each}
	</Fade>
{:else}
	<Fade><div class="error">El usuario <b>@{name}</b> no existe :(</div></Fade>
{/if}

<style lang="scss">
	@use "$lib/commons/theme";

	hr {
		border-color: theme.$colorNeutralDark;
		margin: 0;
	}

	.error {
		font-size: 2rem;
		padding: 0 1rem;
	}
</style>
