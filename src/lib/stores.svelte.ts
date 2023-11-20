import { get } from "$lib/commons/utils/fetch";
import type { Post, User } from "$lib/database";

class Store {
	posts = $state<{ elements: Record<string, Post>; all: number[]; following: number[] }>({
		elements: {},
		all: [],
		following: [],
	});
	users = $state<Record<string, User & { posts: number[] }>>({});
}

export const store = new Store();

export const updatePosts = ({
	all,
	following,
}: {
	all?: null | Post[];
	following?: null | Post[];
}) => {
	if (all) {
		const ids: number[] = [];

		all.forEach((post) => {
			store.posts.elements[post.id] = post;
			ids.push(post.id);
		});

		store.posts.all = ids;
	}

	if (following) {
		const ids: number[] = [];

		following.forEach((post) => {
			store.posts.elements[post.id] = post;
			ids.push(post.id);
		});

		store.posts.following = ids;
	}

	store.posts = { ...store.posts };
};

export const invalidateUsers = async (name: string) => {
	const [user, following] = await Promise.all([
		get<User>(`/api/user/${name}`),
		get<Post[]>("/api/post/following"),
	]);

	updatePosts({ following });

	store.users[user.id] = { ...store.users[user.id], ...user };

	store.users = { ...store.users };
};
