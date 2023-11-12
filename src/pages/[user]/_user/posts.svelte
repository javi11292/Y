<script lang="ts">
	import PostComponent from "$lib/components/post";
	import type { Post, User } from "$lib/database";
	import { users } from "$lib/stores";
	import { addUser } from "./load";

	export let user: User;
	export let posts: Post[];

	addUser($users, user, posts);
</script>

{#each $users[user.id].posts as post}
	<PostComponent id={post} />
{/each}
