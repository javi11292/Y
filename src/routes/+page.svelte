<script lang="ts">
	import Post from "$lib/components/post";

	export let data;
</script>

<Post />

{#await data.streamed.posts then posts}
	{#each posts as post}
		<div class="post">
			<div class="author">@{post.author}</div>
			{post.content}
		</div>
	{/each}
{/await}

<style lang="scss">
	@use "$lib/commons/theme";

	.post {
		border-bottom: 1px solid theme.$colorNeutralDark;
		padding: 1rem;
	}

	.author {
		font-weight: bold;
		margin-bottom: 0.5rem;
	}
</style>
