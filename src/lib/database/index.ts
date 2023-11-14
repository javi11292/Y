import type { Database } from "$lib/supabase";
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient<Database>(
	import.meta.env.SUPABASE_URL,
	import.meta.env.SUPABASE_ADMIN,
	{
		auth: {
			autoRefreshToken: false,
			persistSession: false,
		},
	},
);

type Table<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Row"];

export type Post = Table<"post">;
export type User = {
	id: string;
	name: string;
	following: [{ count: number }];
	followers: [{ count: number }];
	isFollowing: boolean;
};
