import { writable } from "svelte/store";

export enum tabs {
	tab1,
	tab2,
}

export const tab = writable({ active: tabs.tab1, direction: 1 });
