import type { Post } from "@prisma/client";
import { writable } from "svelte/store";

export const posts = writable<{
	elements: Record<string, Post>;
	all: number[];
	following: number[];
}>({ elements: {}, all: [], following: [] });
