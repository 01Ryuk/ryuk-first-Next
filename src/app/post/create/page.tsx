import { createPost } from "@/src/actions/actions";
 export default function CreatePostPage() {
  return (
    <div className="text-center pt-12">
      <h1 className="text-3xl capitalize font-bold">Create a new post</h1>
      <form
             action={createPost}
             className="flex flex-col gap-y-2 max-w-md mx-auto mt-8 w[400px]"
           >
             <input
               type="text"
               name="title"
               placeholder="Title"
               className="border border-gray-300 rounded-md p-2"
             />
             <textarea
               name="content"
               rows={5}
               placeholder="Content"
               className="border border-gray-300 rounded-md p-2"
             />
             <button
               type="submit"
               className="bg-blue-500 text-white px-4 py-2 rounded-sm"
             >
               Create Post
             </button>
           </form>
    </div>
  );
}