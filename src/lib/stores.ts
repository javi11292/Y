import type { Post } from "$lib/database";
import { writable } from "svelte/store";

export const posts = writable<{
	elements: Record<string, Post>;
	all: number[];
	following: number[];
}>({ elements: {}, all: [], following: [] });

export const setPosts = (nextPosts: Post[]) => {
	const all: number[] = [];

	const normalized = nextPosts.reduce<Record<string, Post>>((acc, post) => {
		acc[post.id] = post;
		all.push(post.id);
		return acc;
	}, {});

	posts.set({ elements: normalized, all, following: [] });
};
