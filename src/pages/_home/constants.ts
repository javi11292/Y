import { writable } from "svelte/store";

export enum tabs {
	tab1,
	tab2,
}

export const active = writable<tabs>(tabs.tab1);
export const direction = writable<1 | -1>(1);
