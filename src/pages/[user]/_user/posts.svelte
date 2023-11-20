<script lang="ts">
	import Fade from "$lib/commons/components/fade";
	import Loading from "$lib/components/loading";
	import PostComponent from "$lib/components/post";
	import { store } from "$lib/stores.svelte";
	import { data } from "./load";

	type Props = { name: string };

	let { name } = $props<Props>();

	data.load(`[user] ${name}`);
</script>

{#if data.loading}
	<Loading />
{:else if data.response?.user}
	<Fade>
		<div><hr /></div>

		{#each store.users[data.response.user.id].posts as post}
			<PostComponent id={post} />
		{/each}
	</Fade>
{:else}
	<Fade><span class="error">El usuario <b>@{name}</b> no existe :(</span></Fade>
{/if}

<style lang="scss">
	@use "$lib/commons/theme";

	hr {
		border-color: theme.$colorNeutralDark;
	}

	.error {
		font-size: 2rem;
	}
</style>
