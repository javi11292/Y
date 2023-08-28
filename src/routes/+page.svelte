<script lang="ts">
	import Post from "$lib/components/post";

	export let data;
</script>

<Post />

{#if data.posts}
	{#await data.posts then posts}
		{#each posts as post}
			<div>{post.content}</div>
		{/each}
	{/await}
{/if}
