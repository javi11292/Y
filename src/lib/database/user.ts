import type { SupabaseClient } from "@supabase/supabase-js";

type Args = { id: string; email: string; name: string };

export const addUser = async (supabase: SupabaseClient, { id, email, name }: Args) => {
	const { data, error } = await supabase.from("user").insert({ id, email, name }).select().single();

	if (error) {
		throw error;
	}

	return data;
};
