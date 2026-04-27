"use server";
import { prisma } from "@/src/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Prisma } from "../generated/prisma";
import { auth } from "../lib/auth";
import { headers } from "next/headers";

// --- Post Actions ---

export async function createPost(formData: FormData) {
  try {
    await prisma.post.create({
      data: {
        title: formData.get("title") as string,
        slug: (formData.get("title") as string)
          .toLowerCase()
          .replace(/\s+/g, "-"),
        content: formData.get("content") as string,
        published: true,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        console.error("A post with this slug already exists.");
      } else {
        console.error("An error occurred while creating the post:", error);
      }
    }
  }
  revalidatePath("/post");
  redirect("/post");
}

export async function edit(id: string, formData: FormData) {
  const newTitle = formData.get("title") as string;
  const newSlug = newTitle
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");

  await prisma.post.update({
    where: { id },
    data: {
      title: newTitle,
      slug: newSlug,
      content: formData.get("content") as string,
      published: true,
    },
  });

  revalidatePath("/post");
  redirect(`/post/${newSlug}`);
}

export async function deletePost(id: string, formData: FormData) {
  await prisma.post.delete({ where: { id } });
  revalidatePath("/post");
}

// --- Auth Actions ---

export const signUp = async (email: string, password: string, name: string) => {
  try {
    await auth.api.signUpEmail({
      body: { email, password, name },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create account";
    return { error: message };
  }
  redirect("/auth/login");
};

export const signIn = async (email: string, password: string) => {
  try {
    await auth.api.signInEmail({
      body: { email, password },
    });
  } catch (error: unknown) {
    return { error: (error as Error)?.message || "Invalid email or password" };
  }
  redirect("/dashboard");
};

export const signInSocial = async (provider: "github" | "google") => {
  const result = await auth.api.signInSocial({
    body: {
      provider,
      callbackURL: "/dashboard",
    },
  });

  if (result?.url) {
    redirect(result.url);
  }
};

export const signOut = async () => {
  await auth.api.signOut({
    headers: await headers(), // forward cookies so Better Auth can invalidate the session
  });
  redirect("/auth/login");
};
