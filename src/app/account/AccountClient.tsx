"use client";

import { useState } from "react";
import { auth } from "@/src/lib/auth";
import Image from "next/image";
import { updateProfile } from "@/src/actions/actions";
import { useRouter } from "next/navigation";
import Avatar from "@/src/components/Avatar";


type Session = typeof auth.$Infer.Session;

export default function AccountClient({ session }: { session: Session }) {
  const user = session.user;
  const router = useRouter();

  const [name, setName] = useState(user.name);
  const [preview, setPreview] = useState<string | null>(user.image ?? null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // show preview before uploading
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccess(false);
    setError("");

    try {
      const formData = new FormData(e.currentTarget);
      const result = await updateProfile(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        setTimeout(() => router.push("/dashboard"), 1500); // 👈 redirect after 1.5s so user sees the success message
      }
    } catch (err) {
      if (err instanceof Error && err.message === "NEXT_REDIRECT") return;
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">My Account</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Avatar section */}
        <div className="flex flex-col items-center gap-4">
          {/* show profile picture or initials placeholder */}
          <div className="relative w-24 h-24 rounded-full overflow-hidden bg-indigo-100 flex items-center justify-center">
            <Avatar name={name} image={preview} size="lg" />

          </div>

          {/* file input styled as a button */}
          <label className="cursor-pointer text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors">
            Change profile picture
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden" // 👈 hide the default ugly file input, the label acts as the button
            />
          </label>
        </div>

        {/* Name field */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />
        </div>

        {/* Email field — display only, cant be changed */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            type="email"
            value={user.email}
            disabled // 👈 email cant be changed since its tied to auth
            className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
          />
          <p className="text-xs text-gray-400">Email cannot be changed</p>
        </div>

        {/* success/error messages */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3">
            <p className="text-sm text-green-700">
              Profile updated successfully!
            </p>
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
