import type { Post } from "@prisma/client";
import { prisma } from ".";

type AddPost = (args: { content: string; author: string }) => Promise<Post>;

export const addPost: AddPost = ({ content, author }) => {
	return prisma.post.create({ data: { content, authorId: author } });
};
