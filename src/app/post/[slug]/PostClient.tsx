"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Pencil, Trash2, Heart, Send, Trash } from "lucide-react";
import { deletePost, addComment, deleteComment, toggleLike } from "@/src/actions/actions";
import Avatar from "@/src/components/Avatar";

type Comment = {
  id: string;
  content: string;
  createdAt: Date;
  authorId: string;
  author: { name: string; image: string | null } | null;
};

type Post = {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  authorId: string | null;
  image: string | null;
  author: { name: string; image: string | null } | null;
  comments: Comment[];
};

interface PostClientProps {
  post: Post;
  isAuthor: boolean;
  hasLiked: boolean;
  likeCount: number;
  userId: string | null;
}

export default function PostClient({
  post,
  isAuthor,
  hasLiked,
  likeCount,
  userId,
}: PostClientProps) {
  const [comments, setComments] = useState<Comment[]>(post.comments);
  const [liked, setLiked] = useState(hasLiked);
  const [likes, setLikes] = useState(likeCount);
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);

  const handleLike = async () => {
    if (!userId) return; // not logged in
    if (post.authorId === userId) return; // cant like own post

    // optimistic update — update UI immediately before server responds
    setLiked((prev) => !prev);
    setLikes((prev) => (liked ? prev - 1 : prev + 1));
    setLikeLoading(true);

    const result = await toggleLike(post.id);

    // if server returns an error, revert the optimistic update
    if (result?.error) {
      setLiked((prev) => !prev);
      setLikes((prev) => (liked ? prev + 1 : prev - 1));
    }

    setLikeLoading(false);
  };

  const handleAddComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("content", commentText);

    const result = await addComment(post.id, formData);

    if (!result?.error) {
      // add comment to UI optimistically
      const newComment: Comment = {
        id: crypto.randomUUID(), // temp id
        content: commentText,
        createdAt: new Date(),
        authorId: userId!,
        author: { name: "You", image: null },
      };
      setComments((prev) => [newComment, ...prev]);
      setCommentText("");
    }

    setIsSubmitting(false);
  };

  const handleDeleteComment = async (commentId: string) => {
    // optimistically remove from UI
    setComments((prev) => prev.filter((c) => c.id !== commentId));
    await deleteComment(commentId);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 pt-16 pb-24">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold capitalize leading-tight mb-3">
          {post.title}
        </h1>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar
              name={post.author?.name ?? "Unknown"}
              image={post.author?.image}
              size="sm"
            />
            <div>
              <p className="text-sm font-medium text-gray-700">
                {post.author?.name ?? "Unknown"}
              </p>
              <p className="text-xs text-gray-400">
                {new Date(post.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* edit/delete only for author */}
          {isAuthor && (
            <div className="flex gap-2">
              <Link href={`/post/${post.id}/edit`}>
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

      <hr className="border-gray-200 mb-8" />

      {/* Cover image */}
      {post.image && (
        <div className="relative w-full h-72 rounded-xl overflow-hidden mb-8">
          <Image
            src={post.image}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 672px"
            className="object-cover"
            priority
            loading="eager"
          />
        </div>
      )}

      {/* Content */}
      <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">
        {post.content}
      </p>

      {/* Like button */}
      <div className="flex items-center gap-2 mt-8 pt-6 border-t border-gray-100">
        <button
          onClick={handleLike}
          disabled={likeLoading || !userId || post.authorId === userId}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            liked
              ? "bg-red-50 text-red-500 hover:bg-red-100"
              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <Heart size={16} className={liked ? "fill-red-500" : ""} />
          {likes} {likes === 1 ? "Like" : "Likes"}
        </button>

        {/* show why like is disabled */}
        {!userId && (
          <p className="text-xs text-gray-400">Sign in to like this post</p>
        )}
        {userId && post.authorId === userId && (
          <p className="text-xs text-gray-400">You can&apos;t like your own post</p>
        )}
      </div>

      {/* Comments section */}
      <div className="mt-10">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Comments ({comments.length})
        </h2>

        {/* Comment form — only for logged in users */}
        {userId ? (
          <form onSubmit={handleAddComment} className="flex gap-3 mb-8">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              rows={2}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none"
            />
            <button
              type="submit"
              disabled={isSubmitting || !commentText.trim()}
              className="self-end flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={14} />
              {isSubmitting ? "Posting..." : "Post"}
            </button>
          </form>
        ) : (
          <p className="text-sm text-gray-500 mb-8">
            <Link href="/auth/login" className="text-indigo-500 hover:underline">
              Sign in
            </Link>{" "}
            to leave a comment
          </p>
        )}

        {/* Comments list */}
        <div className="flex flex-col gap-4">
          {comments.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">
              No comments yet. Be the first to comment!
            </p>
          ) : (
            comments.map((comment) => (
              <div
                key={comment.id}
                className="flex gap-3 p-4 bg-gray-50 rounded-xl"
              >
                <Avatar
                  name={comment.author?.name ?? "Unknown"}
                  image={comment.author?.image}
                  size="sm"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-semibold text-gray-900">
                      {comment.author?.name ?? "Unknown"}
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-gray-400">
                        {new Date(comment.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                      {/* only show delete to comment author */}
                      {comment.authorId === userId && (
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="text-gray-300 hover:text-red-500 transition-colors"
                        >
                          <Trash size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {comment.content}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

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
