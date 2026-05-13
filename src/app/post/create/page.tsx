"use client";

import { useState } from "react";
import { createPost } from "@/src/actions/actions";
import Image from "next/image";

export default function CreatePostPage() {
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // show a preview of the image before uploading
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      await createPost(formData);
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="text-center pt-12">
      <h1 className="text-3xl capitalize font-bold">Create a new post</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-y-2 max-w-md mx-auto mt-8"
      >
        <input
          type="text"
          name="title"
          placeholder="Title"
          required
          className="border border-gray-300 rounded-md p-2"
        />
        <textarea
          name="content"
          rows={5}
          placeholder="Content"
          required
          className="border border-gray-300 rounded-md p-2"
        />

        {/* Image upload field */}
        <div className="flex flex-col gap-y-2">
          <label className="text-left text-sm font-medium text-gray-700">
            Cover Image (optional)
          </label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            className="border border-gray-300 rounded-md p-2 text-sm"
          />
          {/* Preview */}
          {preview && (
            <div className="relative w-full h-48 rounded-md overflow-hidden">
              <Image
                src={preview}
                alt="Preview"
                fill
                className="object-cover"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-500 text-white px-4 py-2 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Creating..." : "Create Post"}
        </button>
      </form>
    </div>
  );
}
