<script lang="ts">
	import Fade from "$lib/commons/components/fade";
	import Loading from "$lib/components/loading";
	import PostComponent from "$lib/components/post";
	import { users } from "$lib/stores";
	import { data, load, loading } from "./load";

	type Props = { name: string };

	let { name } = $props<Props>();

	load(`[user] ${name}`);
</script>

{#if $loading}
	<Loading />
{:else if $data?.user}
	<Fade>
		<div><hr /></div>

		{#each $users[$data.user.id].posts as post}
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
