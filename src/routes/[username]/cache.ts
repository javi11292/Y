import type { PostId } from "$lib/models/post";
import type { User } from "$lib/models/user";
import { setupCache } from "$lib/utils/cache";

const userCache = setupCache<User>();
const postsCache = setupCache<PostId[]>();

export const bustUserCache = userCache.bustCache;
export const getUserCache = userCache.getCache;

export const bustPostsCache = postsCache.bustCache;
export const getPostsCache = postsCache.getCache;
