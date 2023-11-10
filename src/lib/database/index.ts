import type { Database } from "$lib/supabase";
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient<Database>(
	import.meta.env.SUPABASE_URL,
	import.meta.env.SUPABASE_KEY
);

export const admin = createClient<Database>(
	import.meta.env.SUPABASE_URL,
	import.meta.env.SUPABASE_ADMIN,
	{
		auth: {
			autoRefreshToken: false,
			persistSession: false,
		},
	}
).auth.admin;

export type Table<T extends keyof Database["public"]["Tables"]> =
	Database["public"]["Tables"][T]["Row"];
