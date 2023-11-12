import { supabase, type Post } from ".";

const PAGE_SIZE = 20;

export const addPost = async (value: { content: string; author: string }) => {
	const { data, error } = await supabase
		.from("post")
		.insert({ ...value, date: new Date().toISOString() })
		.select("*, ...user (author:name)")
		.single<Post>();

	if (error) {
		throw error;
	}

	return data;
};

export const getPosts = async (id?: string) => {
	let query = supabase.from("post").select("*, ...user (author:name)").limit(PAGE_SIZE);

	if (id) {
		query = query.lt("id", id);
	}

	const { data, error } = await query.order("id", { ascending: false }).returns<Post>();

	if (error) {
		throw error;
	}

	return data;
};

export const getFollowingPosts = async ({ user, id }: { user: string; id?: string }) => {
	let query = supabase
		.from("post")
		.select("*, ...user!inner (author:name, follow!follow_id_fkey!inner ())")
		.eq("user.follow.follower", user)
		.limit(PAGE_SIZE);

	if (id) {
		query = query.lt("id", id);
	}

	const { data, error } = await query.order("id", { ascending: false }).returns<Post>();

	if (error) {
		throw error;
	}

	return data;
};
