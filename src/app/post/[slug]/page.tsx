import { prisma } from "@/src/lib/prisma";
import { notFound } from "next/navigation";
import { auth } from "@/src/lib/auth";
import { headers } from "next/headers";
import PostClient from "./PostClient";

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!slug) notFound();

  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user.id;

  const post = await prisma.post.findUnique({
    where: { slug },
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
      authorId: true,
      image: true,
      author: {
        select: { name: true, image: true },
      },
      // fetch comments with author info
      comments: {
        select: {
          id: true,
          content: true,
          createdAt: true,
          authorId: true,
          author: {
            select: { name: true, image: true },
          },
        },
        orderBy: { createdAt: "desc" },
      },
      // fetch likes
      likes: {
        select: { authorId: true },
      },
    },
  });

  if (!post) notFound();

  const isAuthor = userId === post.authorId;
  // check if the current user has liked this post
  const hasLiked = post.likes.some((like) => like.authorId === userId);
  const likeCount = post.likes.length;

  return (
    <PostClient
      post={post}
      isAuthor={isAuthor}
      hasLiked={hasLiked}
      likeCount={likeCount}
      userId={userId ?? null}
    />
  );
}