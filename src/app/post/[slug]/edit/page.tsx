import { edit } from "@/src/actions/actions";
import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

interface EditPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { slug } = await params;

  if (!slug) {
    notFound();
  }

  // const post = await prisma.post.findUnique({
  //   where: {
  //     slug,
  //   },
  // });

  // if (!post) {
  //   notFound();
  // }

  // verify the user is logged in and is the author of the post before allowing them to edit
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) redirect("/auth/login");

  const post = await prisma.post.findUnique({ where: { slug } });
  if (!post) throw new Error("Post not found");
  // only the author of the post can edit it
  if (post.authorId !== session.user.id) redirect("/post");

  return (
    <div className="text-center pt-12">
      <h1 className="text-3xl capitalize font-bold">Edit Post</h1>
      <form
        action={edit.bind(null, post.id)}
        className="flex flex-col gap-y-2 max-w-md mx-auto mt-8 w[400px]"
      >
        <input
          type="text"
          name="title"
          defaultValue={post.title}
          placeholder="Title"
          className="border border-gray-300 rounded-md p-2"
        />
        <textarea
          name="content"
          rows={5}
          defaultValue={post.content}
          placeholder="Content"
          className="border border-gray-300 rounded-md p-2"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-sm"
        >
          Update Post
        </button>
      </form>
    </div>
  );
}
