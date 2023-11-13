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

export const updatePosts = ({ all, following }: { all?: Post[]; following?: Post[] }) => {
	posts.update((value) => {
		if (all) {
			const ids: number[] = [];

			all.forEach((post) => {
				value.elements[post.id] = post;
				ids.push(post.id);
			});

			value.all = ids;
		}

		if (following) {
			const ids: number[] = [];

			following.forEach((post) => {
				value.elements[post.id] = post;
				ids.push(post.id);
			});

			value.following = ids;
		}

		return value;
	});
};

export const invalidateUsers = async (name: string) => {
	const [user, following] = await Promise.all([
		get<User>(`/api/user/@${name}`),
		get<Post[]>("/api/post/following"),
	]);

	updatePosts({ following });

	users.update((state) => {
		Object.assign(state[user.id], user);
		return state;
	});
};
