<script lang="ts">
	import Fade from "$lib/commons/components/fade";
	import PostComponent from "$lib/components/post";
	import { users } from "$lib/stores";
	import { data, load } from "./load";

	export let name: string;

	load(`[user] @${name}`);
</script>

{#if $data?.user}
	<Fade>
		{#each $users[$data.user.id].posts as post}
			<PostComponent id={post} />
		{/each}
	</Fade>
{/if}
