import { prisma } from "@/src/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!slug) {
    notFound();
  }

  const post = await prisma.post.findUnique({
    where: {
      slug,
    },
  });

  if (!post) {
    notFound();
  }

  return (
    <div className="text-center pt-12">
      <h1 className="text-3xl capitalize font-bold">{post.title}</h1>
      <p className="text-gray-500 mt-4">{post.content}</p>
      <div className="mt-8">   
        <Link
        href="/post"
        className="bg-blue-500 text-white px-4 py-2 rounded-sm mt-4"
      >
        Go Back
      </Link>
        </div>
    </div>
  );
}
