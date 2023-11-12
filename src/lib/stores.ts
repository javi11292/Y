import { get } from "$lib/commons/utils/fetch";
import type { Post, User } from "$lib/database";
import { writable } from "svelte/store";

export type Users = Record<string, User & { posts: number[] }>;
export type Posts = {
	elements: Record<string, Post>;
	all: number[];
	following: number[];
};

export const posts = writable<Posts>({ elements: {}, all: [], following: [] });

export const users = writable<Users>({});

export const load = {
	post: true,
};

export const updatePosts = ({
	nextPosts,
	nextFollowing,
}: {
	nextPosts?: Post[];
	nextFollowing?: Post[];
}) => {
	posts.update((value) => {
		if (nextPosts) {
			const all: number[] = [];

			nextPosts.forEach((post) => {
				value.elements[post.id] = post;
				all.push(post.id);
			});

			value.all = all;
		}

		if (nextFollowing) {
			const following: number[] = [];

			nextFollowing.forEach((post) => {
				value.elements[post.id] = post;
				following.push(post.id);
			});

			value.following = following;
		}

		return value;
	});
};

export const loadPosts = (nextPosts: Post[], nextFollowing: Post[]) => {
	if (!load.post) {
		return;
	}

	load.post = false;
	updatePosts({ nextPosts, nextFollowing });
};

export const invalidateUsers = async (name: string) => {
	const [user, following] = await Promise.all([
		get<User>(`/api/user/@${name}`),
		get<Post[]>("/api/post/following"),
	]);

	updatePosts({ nextFollowing: following });
	users.update((state) => {
		Object.assign(state[user.id], user);
		return state;
	});
};
