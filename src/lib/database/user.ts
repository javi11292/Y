import { supabase } from ".";

type Args = { id: string; email: string; name: string };

export const addUser = async ({ id, email, name }: Args) => {
	const { data, error } = await supabase.from("user").insert({ id, email, name }).select().single();

	if (error) {
		throw error;
	}

	return data;
};
