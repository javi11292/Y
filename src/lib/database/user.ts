import { getClient } from "./supabase";

export const addUser = async (value: { id: string; email: string; name: string }) => {
	const { data, error } = await getClient().from("user").insert(value).select().single();

	if (error) {
		throw error;
	}

	return data;
};

export const getUser = async ({ name, id }: { name: string; id: string }) => {
	const userQuery = getClient()
		.from("user")
		.select(
			"id, name, followers:follow!follow_id_fkey (follower), following:follow!follow_follower_fkey (id)",
		)
		.eq("name", name)
		.single();

	const followedQuery = getClient()
		.from("user")
		.select("follow!follow_id_fkey!inner (*)")
		.match({ name, "follow.follower": id })
		.single();

	const [user, followed] = await Promise.all([userQuery, followedQuery]);

	if (!user.data) {
		return null;
	}

	return {
		...user.data,
		following: user.data.following.length,
		followers: user.data.followers.length,
		followed: !!followed.data,
	};
};

export const followUser = async ({ id, follower }: { id: string; follower: string }) => {
	const { data } = await getClient().from("follow").select().match({ id, follower }).single();

	if (!data) {
		await getClient().from("follow").insert({ id, follower });
	} else {
		await getClient().from("follow").delete().match({ id, follower });
	}
};
