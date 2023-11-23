import type { Data } from ".";
import { getClient } from "./supabase";

const PAGE_SIZE = 20;

const selectPosts = () =>
	getClient()
		.from("post")
		.select(
			"*, user!post_author_fkey!inner (author:name), like (user), thread!thread_thread_fkey (thread)",
		)
		.limit(PAGE_SIZE);

const formatPost = ({ data, user }: { data: Data<typeof selectPosts>; user: string }) =>
	data &&
	data.map((entry) => {
		const { user: userField, like, thread, ...props } = entry;

		return {
			...props,
			author: (userField as { author: string }).author,
			likes: like.length,
			liked: like.some(({ user: userId }) => user === userId),
			replies: thread.length,
		};
	});

export const addPost = async ({
	content,
	author,
	thread,
}: {
	content: string;
	author: string;
	thread?: number;
}) => {
	const { data } = await getClient()
		.from("post")
		.insert({ content, author, date: new Date().toISOString() })
		.select(
			"*, user!post_author_fkey (author:name), like (user), thread!thread_thread_fkey (thread)",
		);

	if (thread && data?.[0]) {
		await getClient().from("thread").insert({ id: data[0].id, thread });
	}

	const formatted = formatPost({ data, user: author });

	return formatted?.[0];
};

export const likePost = async ({ post, user }: { post: number; user: string }) => {
	const { data } = await getClient().from("like").select().match({ post, user }).single();

	if (!data) {
		await getClient().from("like").insert({ post, user });
	} else {
		await getClient().from("like").delete().match({ post, user });
	}
};

export const getPosts = async ({
	id,
	name,
	user,
}: {
	id?: string;
	name?: string;
	user: string;
}) => {
	let query = selectPosts();

	if (id) {
		query = query.lt("id", id);
	}

	if (name) {
		query.eq("user.name", name);
	}

	const { data } = await query.order("id", { ascending: false });

	return formatPost({ data, user });
};

export const getFollowingPosts = async ({ user, id }: { user: string; id?: string }) => {
	let query = getClient()
		.from("post")
		.select(
			"*, user!post_author_fkey!inner (author:name, follow!follow_id_fkey!inner ()), like (user), thread!thread_thread_fkey (thread)",
		)
		.eq("user.follow.follower", user)
		.limit(PAGE_SIZE);

	if (id) {
		query = query.lt("id", id);
	}

	const { data } = await query.order("id", { ascending: false });

	return formatPost({ data: data as unknown as Data<typeof selectPosts>, user });
};
