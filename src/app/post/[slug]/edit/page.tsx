import { edit } from "@/src/actions/actions";
import { prisma } from "@/src/lib/prisma";
import { notFound } from "next/navigation";

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
