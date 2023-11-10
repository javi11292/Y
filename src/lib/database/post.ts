import { supabase } from ".";

type Args = { content: string; author: string };

const PAGE_SIZE = 20;

export const addPost = async ({ content, author }: Args) => {
	const { data, error } = await supabase
		.from("post")
		.insert({ content, author, date: new Date().toISOString() })
		.select("*, author:user (name)")
		.single();

	if (error) {
		throw error;
	}

	return data;
};

export const getPosts = async (id?: string) => {
	let query = supabase.from("post").select("*, author:user (name)").limit(PAGE_SIZE);

	if (id) {
		query = query.lt("id", id);
	}

	const { data, error } = await query.order("id", { ascending: false });

	if (error) {
		throw error;
	}

	return data;
};

export type Post = Awaited<ReturnType<typeof getPosts>>[0];
