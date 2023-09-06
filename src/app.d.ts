import type { User } from "$lib/models/user";

declare global {
	namespace App {
		interface Locals {
			user: User;
			pathname: string;
		}
	}
}

export {};
