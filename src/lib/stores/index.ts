import type { PostId } from "$lib/models/post";
import { writable } from "svelte/store";

export const scroll = writable(true);

export const posts = writable<{
	elements: Record<string, PostId>;
	all: string[];
	following: string[];
}>({ elements: {}, all: [], following: [] });
