"use client";
import { useState } from "react";
import { edit } from "@/src/actions/actions";
import Image from "next/image";
import { prisma } from "@/src/lib/prisma";


type Post = NonNullable<Awaited<ReturnType<typeof prisma.post.findUnique>>>;


export default function EditPostClient({ post }: { post: Post }) {
  const [preview, setPreview] = useState<string | null>(post.image ?? null);
  const [isLoading, setIsLoading] = useState(false);
  const [removeImage, setRemoveImage] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setRemoveImage(false);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    setRemoveImage(true);
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
    const formData = new FormData(e.currentTarget);
    //pass removeimage flag so the action removes the image
    formData.append("removeImage", removeImage.toString());
    await edit(post.id, formData);
    } catch (err) {
      if (err instanceof Error && err.message === "NEXT_REDIRECT") return;
        console.error("Edit post error:", err);
      } finally {
        setIsLoading(false);
      }
  };

  return (
    <div className="text-center pt-12">
      <h1 className="text-3xl capitalize font-bold">Edit Post</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-y-2 max-w-md mx-auto mt-8"
      >
        <input
          type="text"
          name="title"
          defaultValue={post.title}
          placeholder="Title"
          required
          className="border border-gray-300 rounded-md p-2"
        />
        <textarea
          name="content"
          rows={5}
          defaultValue={post.content}
          placeholder="Content"
          required
          className="border border-gray-300 rounded-md p-2"
        />
        {/* Image upload field */}
        <div className="flex flex-col gap-y-2">
          <label className="text-left text-sm font-medium text-gray-700">
            Cover Image (optional)
          </label>

          {/* show existing or new preview */}
          {preview && (
            <div className="relative w-full h-48 rounded-md overflow-hidden">
              <Image
                src={preview}
                alt="Preview"
                fill
                className="object-cover"
              />
              {/* remove image button */}
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600 transition-colors"
              >
                Remove
              </button>
            </div>
          )}

          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            className="border border-gray-300 rounded-md p-2 text-sm"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-500 text-white px-4 py-2 rounded-sm"
        >
          {isLoading ? "Updating..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
