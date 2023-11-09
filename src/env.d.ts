/// <reference types="astro/client" />

declare type Auth = import("@supabase/supabase-js").SupabaseClient["auth"];
declare type User = import("@supabase/supabase-js").User;

declare namespace App {
	interface Locals {
		user: User;
		auth: Auth;
	}
}
