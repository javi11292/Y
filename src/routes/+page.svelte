<script lang="ts">
	import Post from "$lib/components/post";

	export let data;
</script>

<Post />

{#await data.streamed.posts then posts}
	{#each posts as post}
		<div>{post.content}</div>
	{/each}
{/await}
