/// <reference types="astro/client" />

declare type Supabase = import("@supabase/supabase-js").SupabaseClient;
declare type User = import("@supabase/supabase-js").User;

declare namespace App {
	interface Locals {
		user?: User;
		supabase: Supabase;
	}
}
