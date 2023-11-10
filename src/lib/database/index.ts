import type { Database } from "$lib/supabase";
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient<Database>(
	import.meta.env.SUPABASE_URL,
	import.meta.env.SUPABASE_KEY
);

type Table<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Row"];

export type Post = Table<"post">;
export type User = Table<"user">;
