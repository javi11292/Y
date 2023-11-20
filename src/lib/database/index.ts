import type { Database } from "$lib/supabase";
import { createClient } from "@supabase/supabase-js";

console.log("LALALA", import.meta.env.SUPABASE_URL);

export const supabase = createClient<Database>(
	import.meta.env.SUPABASE_URL || "https://daislqwxhhgdcrkfthho.supabase.co",
	import.meta.env.SUPABASE_ADMIN || "admin",
	{
		auth: {
			autoRefreshToken: false,
			persistSession: false,
		},
	},
);

type Result<T> = T extends PromiseLike<infer U> ? U : never;

export type Data<T extends () => {}> = Result<ReturnType<T>> extends { data: unknown }
	? Result<ReturnType<T>>["data"]
	: never;

export type Post = {
	author: string;
	content: string;
	date: string;
	id: number;
	likes: number;
	liked: boolean;
};

export type User = {
	id: string;
	name: string;
	following: number;
	followers: number;
	followed: boolean;
};
