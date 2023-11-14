import { supabase } from ".";

export const addUser = async (value: { id: string; email: string; name: string }) => {
	const { data, error } = await supabase.from("user").insert(value).select().single();

	if (error) {
		throw error;
	}

	return data;
};

export const getUser = async ({ name, id }: { name: string; id: string }) => {
	const userQuery = supabase
		.from("user")
		.select(
			"id, name, followers:follow!follow_id_fkey (follower), following:follow!follow_follower_fkey (id)",
		)
		.eq("name", name)
		.single();

	const followedQuery = supabase
		.from("user")
		.select("*, followers!follow_id_fkey!inner (*)")
		.match({ name, "followers.follower": id })
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
	const { data } = await supabase.from("follow").select().match({ id, follower }).single();

	if (!data) {
		await supabase.from("follow").insert({ id, follower });
	} else {
		await supabase.from("follow").delete().match({ id, follower });
	}
};
