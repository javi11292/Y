<script lang="ts" context="module">
	import { get } from "$lib/commons/utils/fetch";
	import { getLoad } from "$lib/commons/utils/load";
	import type { Post } from "$lib/database";
	import { loadPosts } from "$lib/stores";

	const load = getLoad(async () => {
		const [posts, following] = await Promise.all([
			get<Post[]>("/api/post/all"),
			get<Post[]>("/api/post/following"),
		]);

		loadPosts(posts, following);
	});
</script>

<script lang="ts">
	import Fade from "$lib/commons/components/fade";
	import Loading from "$lib/components/loading";
	import { fly } from "svelte/transition";
	import { tab } from "./store";
	import Tab from "./tab.svelte";

	const loading = load();
</script>

{#await loading}
	<Loading />
{:then}
	<Fade>
		{#key $tab.active}
			<div
				in:fly={{ x: `${100 * $tab.direction}%`, opacity: 1 }}
				out:fly={{ x: `${-100 * $tab.direction}%`, opacity: 1 }}
			>
				<Tab active={$tab.active} />
			</div>
		{/key}
	</Fade>
{/await}
