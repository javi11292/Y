import { supabase, type Post } from ".";

type AddPost = (args: { content: string; author: string }) => Promise<Post | null>;

export const addPost: AddPost = async ({ content, author }) => {
	const { data, error } = await supabase.from("post").insert({ content, author }).select().single();

	console.log(data, error);

	return data;
};
