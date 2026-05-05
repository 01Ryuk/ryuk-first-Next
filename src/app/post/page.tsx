import { deletePost } from "@/src/actions/actions";
import { prisma } from "@/src/lib/prisma";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Plus, Pencil, Trash2, MessageCircle, Heart } from "lucide-react";
import { auth } from "@/src/lib/auth";
import { headers } from "next/headers";

const POSTS_PER_PAGE = 10;

// helper to format date like "May 1" or "2d ago"
function formatDate(date: Date) {
  const now = new Date();
  const diff = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);

  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;

  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// helper to get initials for the avatar placeholder
function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default async function page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const currentPage = parseInt(page || "1", 10);
  const skip = (currentPage - 1) * POSTS_PER_PAGE;

  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user.id;

  const [posts, postCount] = await Promise.all([
    prisma.post.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        createdAt: true,
        authorId: true,
        author: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: POSTS_PER_PAGE,
      skip,
    }),
    prisma.post.count(),
  ]);

  const totalPages = Math.ceil(postCount / POSTS_PER_PAGE);
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">

      {/* top bar */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-gray-900">Feed</h1>
        <Link
          href="/post/create"
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm rounded-full hover:bg-indigo-700 transition-colors"
        >
          <Plus size={16} /> New Post
        </Link>
      </div>

      {/* feed */}
      <div className="flex flex-col gap-4">
        {posts.map((post) => {
          const authorName = post.author?.name ?? "Unknown";
          const isAuthor = post.authorId === userId;
          // trim content to 120 chars for the excerpt
          const excerpt = post.content.length > 120
            ? post.content.slice(0, 120) + "..."
            : post.content;

          return (
            <div
              key={post.id}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:border-gray-300 transition-colors"
            >
              {/* card header — avatar + name + date */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  {/* avatar placeholder using initials — swap for real image later */}
                  <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-sm font-semibold flex-shrink-0">
                    {getInitials(authorName)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{authorName}</p>
                    {/* formatDate turns the raw date into "2h ago" style */}
                    <p className="text-xs text-gray-400">{formatDate(post.createdAt)}</p>
                  </div>
                </div>

                {/* edit/delete — only visible to the author, subtle not loud */}
                {isAuthor && (
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/post/${post.slug}/edit`}
                      className="text-xs text-gray-400 hover:text-blue-500 transition-colors"
                    >
                      <Pencil size={14} />
                    </Link>
                    <form action={deletePost.bind(null, post.id)}>
                      <button
                        type="submit"
                        className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </form>
                  </div>
                )}
              </div>

              {/* post title + excerpt — whole block links to the post */}
              <Link href={`/post/${post.slug}`}>
                <h2 className="font-bold text-gray-900 mb-1 hover:text-indigo-600 transition-colors">
                  {post.title}
                </h2>
                <p className="text-sm text-gray-500 leading-relaxed">{excerpt}</p>
              </Link>

              {/* card footer — placeholder counts for likes/comments */}
              <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-100">
                <button className="flex items-center gap-1.5 text-gray-400 hover:text-red-500 transition-colors text-sm">
                  <Heart size={16} />
                  <span>0</span>
                </button>
                <button className="flex items-center gap-1.5 text-gray-400 hover:text-indigo-500 transition-colors text-sm">
                  <MessageCircle size={16} />
                  <span>0</span>
                </button>
                <Link
                  href={`/post/${post.slug}`}
                  className="ml-auto text-xs text-indigo-500 hover:text-indigo-700 font-medium"
                >
                  Read more →
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* pagination */}
      <div className="flex justify-center items-center gap-4 mt-8">
        {hasPrevPage ? (
          <Link
            href={`/post?page=${currentPage - 1}`}
            className="flex items-center gap-1 px-3 py-2 bg-gray-100 rounded-full hover:bg-gray-200 text-sm transition-colors"
          >
            <ChevronLeft size={16} /> Previous
          </Link>
        ) : (
          <span className="flex items-center gap-1 px-3 py-2 text-gray-300 text-sm">
            <ChevronLeft size={16} /> Previous
          </span>
        )}

        <span className="text-sm text-gray-500">
          {currentPage} / {totalPages}
        </span>

        {hasNextPage ? (
          <Link
            href={`/post?page=${currentPage + 1}`}
            className="flex items-center gap-1 px-3 py-2 bg-gray-100 rounded-full hover:bg-gray-200 text-sm transition-colors"
          >
            Next <ChevronRight size={16} />
          </Link>
        ) : (
          <span className="flex items-center gap-1 px-3 py-2 text-gray-300 text-sm">
            Next <ChevronRight size={16} />
          </span>
        )}
      </div>
    </div>
  );
}