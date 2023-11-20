export enum tabs {
	tab1,
	tab2,
}

class Tab {
	active = $state(tabs.tab1);
}

export const tab = new Tab();
