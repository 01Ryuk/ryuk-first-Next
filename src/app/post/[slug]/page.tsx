import { prisma } from "@/src/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/src/lib/auth";
import { headers } from "next/headers";
import { Pencil } from "lucide-react";
import { deletePost } from "@/src/actions/actions";
import { Trash2 } from "lucide-react";
import Image from "next/image";

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
        select: { name: true },
      },
    },
  });

  if (!post) notFound();

  const isAuthor = userId === post.authorId;

  return (
    <div className="max-w-2xl mx-auto px-4 pt-16 pb-24">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold capitalize leading-tight mb-3">
          {post.title}
        </h1>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>
              By{" "}
              <span className="font-medium text-gray-700">
                {post.author?.name ?? "Unknown"}
              </span>
            </span>
            <span>·</span>
            <span>
              {new Date(post.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>

          {/* edit/delete only for author */}
          {isAuthor && (
            <div className="flex gap-2">
              <Link href={`/post/${slug}/edit`}>
                <button className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                  <Pencil size={14} /> Edit
                </button>
              </Link>
              <form action={deletePost.bind(null, post.id)}>
                <button
                  type="submit"
                  className="flex items-center gap-1 px-3 py-1.5 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Divider */}
      <hr className="border-gray-200 mb-8" />

      {/* Cover image — only shows if post has one */}
      {post.image && (
        <div className="relative w-full h-72 rounded-xl overflow-hidden mb-8">
          <Image
            src={post.image}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 672px"
            className="object-cover"
            priority //tells Next.js to load this image first since it's above the fold
            loading="eager"
          />
        </div>
      )}

      {/* Content */}
      <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">
        {post.content}
      </p>

      {/* Footer */}
      <div className="mt-16">
        <Link
          href="/post"
          className="text-sm text-blue-500 hover:text-blue-700 font-medium"
        >
          ← Back to all posts
        </Link>
      </div>
    </div>
  );
}
