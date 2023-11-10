import { supabase, type Post } from ".";

type AddPost = (args: { content: string; author: string }) => Promise<Post | null>;

export const addPost: AddPost = async ({ content, author }) => {
	const { data } = await supabase
		.from("post")
		.insert({ content, author, date: new Date().toISOString() })
		.select()
		.single();

	return data;
};

export const getPosts = async (id?: string) => {
	let query = supabase.from("post").select();

	if (id) {
		query = query.lt("id", id);
	}

	const { data } = await query.order("id", { ascending: false });

	return data;
};
