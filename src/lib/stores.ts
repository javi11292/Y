import { get } from "$lib/commons/utils/fetch";
import type { Post, User } from "$lib/database";
import { writable } from "svelte/store";

export const posts = writable<{
	elements: Record<string, Post>;
	all: number[];
	following: number[];
}>({ elements: {}, all: [], following: [] });

export const users = writable<Record<string, User>>({});

export const setPosts = (nextPosts: Post[], nextFollowing: Post[]) => {
	const all: number[] = [];
	const following: number[] = [];

	let normalized = nextPosts.reduce<Record<string, Post>>((acc, post) => {
		acc[post.id] = post;
		all.push(post.id);
		return acc;
	}, {});

	normalized = nextFollowing.reduce<Record<string, Post>>((acc, post) => {
		acc[post.id] = post;
		following.push(post.id);
		return acc;
	}, normalized);

	posts.set({ elements: normalized, all, following });
};

export const invalidateUsers = async (name: string) => {
	const [user, posts, following] = await Promise.all([
		get<User>(`/api/user/@${name}`),
		get<Post[]>("/api/post/all"),
		get<Post[]>("/api/post/following"),
	]);

	setPosts(posts, following);
	users.update((state) => ({ ...state, [user.id]: user }));
};
