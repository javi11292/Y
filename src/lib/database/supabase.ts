import type { Database } from "$lib/supabase";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

let supabase: SupabaseClient<Database>;

export const getClient = () => {
	if (!supabase) {
		supabase = createClient<Database>(
			import.meta.env.SUPABASE_URL,
			import.meta.env.SUPABASE_ADMIN,
			{
				auth: {
					autoRefreshToken: false,
					persistSession: false,
				},
			},
		);
	}

	return supabase;
};
