<script lang="ts">
	import Fade from "$lib/commons/components/fade";
	import Loading from "$lib/components/loading";
	import PostComponent from "$lib/components/post";
	import { data } from "./load";

	type Props = {
		id: number;
	};

	let { id } = $props<Props>();
</script>

<PostComponent {id} />

{#if data.loading || !data.response}
	<Loading />
{:else}
	<Fade>
		{#each data.response as id}
			<PostComponent {id} />
		{/each}
	</Fade>
{/if}
