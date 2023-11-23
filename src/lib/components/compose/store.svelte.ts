import type { Post } from "$lib/database";

class Compose {
	value = $state("");
	thread = $state<Post | null>(null);
	open = $state(false);
}

export const compose = new Compose();
