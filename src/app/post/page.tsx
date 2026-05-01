import { deletePost } from "@/src/actions/actions";
import { prisma } from "@/src/lib/prisma";
import Link from "next/link";
import { Eye, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { auth } from "@/src/lib/auth";
import { headers } from "next/headers";

const POSTS_PER_PAGE = 10;

export default async function page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const currentPage = parseInt(page || "1", 10);
  const skip = (currentPage - 1) * POSTS_PER_PAGE;

  // get the logged in user's id
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user.id;

  const [posts, postCount] = await Promise.all([
    prisma.post.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        authorId: true, //need this to compare ownership
        author: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
      take: POSTS_PER_PAGE,
      skip,
    }),
    prisma.post.count(),
  ]);

  const totalPages = Math.ceil(postCount / POSTS_PER_PAGE);
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  return (
    <div className="text-center pt-12">
      <h1 className="text-3xl capitalize font-bold">All Posts ({postCount})</h1>

      <div className="mt-4 mb-10">
        <ul>
          {posts.map((post) => (
            <li
              key={post.id}
              className="mb-2 flex items-center justify-center gap-2"
            >
              <div className="w-40 text-left">
                <span className="truncate block">{post.title}</span>
                <span className="text-xs text-gray-500">
                  by {post.author?.name ?? "Unknown"}
                </span>
              </div>{" "}
              <div className="flex gap-1">
                <Link href={`/post/${post.slug}`}>
                  <button className="p-2 bg-green-500 text-white rounded hover:bg-green-600">
                    <Eye size={16} />
                  </button>
                </Link>

                {/* only show edit/delete if the logged in user is the author */}
                {post.authorId === userId && (
                  <>
                    <Link href={`/post/${post.slug}/edit`}>
                      <button className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                        <Pencil size={16} />
                      </button>
                    </Link>
                    <form action={deletePost.bind(null, post.id)}>
                      <button
                        type="submit"
                        className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </form>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-8">
        {hasPrevPage ? (
          <Link
            href={`/post?page=${currentPage - 1}`}
            className="flex items-center gap-1 px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            <ChevronLeft size={16} /> Previous
          </Link>
        ) : (
          <span className="flex items-center gap-1 px-3 py-2 bg-gray-100 text-gray-400 rounded">
            <ChevronLeft size={16} /> Previous
          </span>
        )}

        <span className="text-sm">
          Page {currentPage} of {totalPages}
        </span>

        {hasNextPage ? (
          <Link
            href={`/post?page=${currentPage + 1}`}
            className="flex items-center gap-1 px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Next <ChevronRight size={16} />
          </Link>
        ) : (
          <span className="flex items-center gap-1 px-3 py-2 bg-gray-100 text-gray-400 rounded">
            Next <ChevronRight size={16} />
          </span>
        )}
      </div>

      <div className="mt-8">
        <Link
          href="/post/create"
          className="text-blue-500 hover:text-blue-700 font-semibold"
        >
          Create a new post
        </Link>
      </div>
    </div>
  );
}
