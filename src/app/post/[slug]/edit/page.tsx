import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import EditPostClient from "./EditPostClient";

interface EditPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { slug } = await params;
  if (!slug) notFound();

  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) redirect("/auth/login");

  const post = await prisma.post.findUnique({ where: { slug } });
  if (!post) notFound();
  if (post.authorId !== session.user.id) redirect("/post");

  return <EditPostClient post={post} />;
}