import { auth } from "@/src/lib/auth";
import DashboardClientPage from "./dashboard-client";
import { headers } from "next/headers";
import { prisma } from "@/src/lib/prisma";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

    // ADDED: if no session, kick to login instead of crashing
  if (!session) redirect("/auth/login");

  // fetch only this user's posts
  const posts = await prisma.post.findMany({
    where: { authorId: session!.user.id },
    select: {
      id: true,
      title: true,
      slug: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  // stats derived from the posts array, no extra DB call needed
  const totalPosts = posts.length;
  const latestPost = posts[0]?.createdAt ?? null; // first item since we ordered by desc

  return (
    <DashboardClientPage
      session={session!}
      posts={posts}
      totalPosts={totalPosts}
      latestPost={latestPost}
    />
  );
}