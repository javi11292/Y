import type { Database } from "$lib/supabase";
import { createClient } from "@supabase/supabase-js";

let client;

try {
	client = createClient<Database>(import.meta.env.SUPABASE_URL, import.meta.env.SUPABASE_ADMIN, {
		auth: {
			autoRefreshToken: false,
			persistSession: false,
		},
	});
} catch {
	throw new Error("LALA" + import.meta.env.SUPABASE_URL);
}

export const supabase = client;
