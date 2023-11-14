import { supabase, type Data } from ".";

const PAGE_SIZE = 20;

const selectPosts = () =>
	supabase
		.from("post")
		.select("*, user!post_author_fkey!inner (author:name), like (user)")
		.limit(PAGE_SIZE);

const formatPost = ({ data, user }: { data: Data<typeof selectPosts>; user: string }) =>
	data &&
	data.map((entry) => {
		const { user: userField, like, ...props } = entry;

		return {
			...props,
			author: (userField as { author: string }).author,
			likes: like.length,
			liked: like.some(({ user: userId }) => user === userId),
		};
	});

export const addPost = async (value: { content: string; author: string }) => {
	const { data } = await supabase
		.from("post")
		.insert({ ...value, date: new Date().toISOString() })
		.select("*, user!post_author_fkey (author:name), like (user)");

	const formatted = formatPost({ data, user: value.author });

	return formatted?.[0];
};

export const likePost = async ({ post, user }: { post: number; user: string }) => {
	const { data } = await supabase.from("like").select().match({ post, user }).single();

	if (!data) {
		await supabase.from("like").insert({ post, user });
	} else {
		await supabase.from("like").delete().match({ post, user });
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
	let query = supabase
		.from("post")
		.select(
			"*, user!post_author_fkey!inner (author:name, follow!follow_id_fkey!inner ()), like (user)",
		)
		.eq("user.follow.follower", user)
		.limit(PAGE_SIZE);

	if (id) {
		query = query.lt("id", id);
	}

	const { data } = await query.order("id", { ascending: false });

	return formatPost({ data: data as unknown as Data<typeof selectPosts>, user });
};
