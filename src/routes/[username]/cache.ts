import type { User } from "$lib/models/user";
import { setupCache } from "$lib/utils/cache";

const { bustCache, getCache } = setupCache<User>();

export { bustCache, getCache };
