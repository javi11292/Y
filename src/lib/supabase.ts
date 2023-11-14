export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
	public: {
		Tables: {
			follow: {
				Row: {
					follower: string;
					id: string;
				};
				Insert: {
					follower: string;
					id: string;
				};
				Update: {
					follower?: string;
					id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "follow_follower_fkey";
						columns: ["follower"];
						isOneToOne: false;
						referencedRelation: "user";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "follow_id_fkey";
						columns: ["id"];
						isOneToOne: false;
						referencedRelation: "user";
						referencedColumns: ["id"];
					},
				];
			};
			like: {
				Row: {
					author: string;
					post: number;
				};
				Insert: {
					author: string;
					post: number;
				};
				Update: {
					author?: string;
					post?: number;
				};
				Relationships: [
					{
						foreignKeyName: "like_author_fkey";
						columns: ["author"];
						isOneToOne: false;
						referencedRelation: "user";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "like_post_fkey";
						columns: ["post"];
						isOneToOne: false;
						referencedRelation: "post";
						referencedColumns: ["id"];
					},
				];
			};
			post: {
				Row: {
					author: string;
					content: string;
					date: string;
					id: number;
				};
				Insert: {
					author: string;
					content: string;
					date: string;
					id?: number;
				};
				Update: {
					author?: string;
					content?: string;
					date?: string;
					id?: number;
				};
				Relationships: [
					{
						foreignKeyName: "post_author_fkey";
						columns: ["author"];
						isOneToOne: false;
						referencedRelation: "user";
						referencedColumns: ["id"];
					},
				];
			};
			user: {
				Row: {
					email: string;
					id: string;
					name: string;
				};
				Insert: {
					email: string;
					id: string;
					name: string;
				};
				Update: {
					email?: string;
					id?: string;
					name?: string;
				};
				Relationships: [
					{
						foreignKeyName: "user_id_fkey";
						columns: ["id"];
						isOneToOne: true;
						referencedRelation: "users";
						referencedColumns: ["id"];
					},
				];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			[_ in never]: never;
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
}
