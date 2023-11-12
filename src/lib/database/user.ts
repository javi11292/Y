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
			"id, name, followers:follow_id_fkey!inner (count), following:follow_follower_fkey!inner (count)"
		)
		.eq("name", name)
		.single();

	const isFollowingQuery = supabase
		.from("user")
		.select("*, followers:follow_id_fkey!inner (*)")
		.match({ name, "followers.follower": id })
		.single();

	const [user, isFollowing] = await Promise.all([userQuery, isFollowingQuery]);

	return { ...user.data, isFollowing: !!isFollowing.data };
};

export const followUser = async ({ id, follower }: { id: string; follower: string }) => {
	const { data: user } = await supabase.from("follow").select().match({ id, follower }).single();

	let error;

	if (!user) {
		const response = await supabase.from("follow").insert({ id, follower });
		error = response.error;
	} else {
		const response = await supabase.from("follow").delete().match({ id, follower });
		error = response.error;
	}

	if (error) {
		throw error;
	}
};
