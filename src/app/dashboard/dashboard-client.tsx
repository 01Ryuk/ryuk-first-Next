"use client";
import { signOut, deletePost } from "@/src/actions/actions";
import { auth } from "@/src/lib/auth";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Plus, FileText } from "lucide-react";
import Avatar from "@/src/components/Avatar";


type Session = typeof auth.$Infer.Session;

type Post = {
  id: string;
  title: string;
  slug: string;
  createdAt: Date;
};

export default function DashboardClientPage({
  session,
  posts,
  totalPosts,
  latestPost,
}: {
  session: Session;
  posts: Post[];
  totalPosts: number;
  latestPost: Date | null;
}) {
  const router = useRouter();
  if (!session) return null;

  const user = session.user;

  const handleSignOut = async () => {
    await signOut();
    router.push("/auth/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <main className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header — welcome + avatar + sign out */}
        <div className="bg-white rounded-lg shadow p-6 mb-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Avatar name={user.name} image={user.image} size="md" />
            <div>
              {/* greeting uses the real user name from session */}
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {user.name}
              </h1>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Sign Out
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* total posts stat */}
          <div className="bg-white rounded-lg shadow p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <FileText className="text-indigo-600" size={22} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Posts</p>
              {/* totalPosts comes from posts.length in page.tsx */}
              <p className="text-3xl font-bold text-gray-900">{totalPosts}</p>
            </div>
          </div>

          {/* latest post date stat */}
          <div className="bg-white rounded-lg shadow p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FileText className="text-green-600" size={22} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Latest Post</p>
              {/* latestPost is posts[0].createdAt — null if no posts yet */}
              <p className="text-lg font-semibold text-gray-900">
                {latestPost
                  ? new Date(latestPost).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "No posts yet"}
              </p>
            </div>
          </div>
        </div>

        {/* Posts table */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Your Posts</h2>
            {/* create post button — prominent, lives next to the heading */}
            <Link
              href="/post/create"
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition-colors"
            >
              <Plus size={16} /> New Post
            </Link>
          </div>

          {posts.length === 0 ? (
            // empty state — better UX than showing an empty table
            <div className="text-center py-12 text-gray-400">
              <FileText size={40} className="mx-auto mb-3 opacity-40" />
              <p>You haven&apos;t written any posts yet.</p>
              <Link
                href="/post/create"
                className="text-indigo-500 hover:underline text-sm mt-2 inline-block"
              >
                Write your first post
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {posts.map((post) => (
                <li
                  key={post.id}
                  className="flex items-center justify-between py-3"
                >
                  <div>
                    <p className="font-medium text-gray-900">{post.title}</p>
                    {/* format the date nicely for each post row */}
                    <p className="text-xs text-gray-400">
                      {new Date(post.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/post/${post.slug}/edit`}>
                      <button className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                        <Pencil size={14} /> Edit
                      </button>
                    </Link>
                    {/* deletePost is a server action bound with the post id */}
                    <form action={deletePost.bind(null, post.id)}>
                      <button
                        type="submit"
                        className="flex items-center gap-1 px-3 py-1.5 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </form>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer nav — kept as you requested for future account management */}
        <div className="flex gap-3">
          <Link
            href="/"
            className="px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            ← Back to Home
          </Link>
          <Link
            href="/account"
            className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Manage Account
          </Link>
        </div>
      </main>
    </div>
  );
}
