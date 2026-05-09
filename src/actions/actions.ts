"use server";
import { prisma } from "@/src/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Prisma } from "../generated/prisma";
import { auth } from "../lib/auth";
import { headers } from "next/headers";
// import { APIError } from "better-auth/api";

// Note: email is handled via better-auth sendResetPassword callback

// --- Post Actions ---

export async function createPost(formData: FormData) {
  //Get sessions and attach authorId to the post
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) redirect("/auth/login");

  try {
    await prisma.post.create({
      data: {
        title: formData.get("title") as string,
        slug: (formData.get("title") as string)
          .toLowerCase()
          .replace(/\s+/g, "-"),
        content: formData.get("content") as string,
        published: true,
        authorId: session!.user.id, //tie each posts to the logged in user
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
  //verify the user is logged in and is the author of the post before allowing them to edit
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) redirect("/auth/login");

  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) throw new Error("Post not found");
  // only the author of the post can edit it
  if (post.authorId !== session.user.id) throw new Error("Unauthorized");
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
  //verify the user is logged in and is the author of the post before allowing them to delete
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) redirect("/auth/login");

  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) throw new Error("Post not found");
  // only the author of the post can delete it
  if (post.authorId !== session.user.id) throw new Error("Unauthorized");
  await prisma.post.delete({ where: { id } });
  revalidatePath("/post");
}

// --- Auth Actions ---

export const signUp = async (email: string, password: string, name: string) => {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "An account with this email already exists" };
    }

    await auth.api.signUpEmail({
      body: { email, password, name },
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to create account";
    return { error: message };
  }

  redirect("/auth/login");
};

export const signIn = async (email: string, password: string) => {
  // check if this email exists but only has social accounts
  const user = await prisma.user.findUnique({
    where: { email },
    include: { accounts: true },
  });

  if (user) {
    const hasSocialAccount = user.accounts.some(
      (account) => account.providerId !== "credential",
    );
    const hasCredentialAccount = user.accounts.some(
      (account) => account.providerId === "credential",
    );

    if (hasSocialAccount && !hasCredentialAccount) {
      const providers = user.accounts.map((a) => a.providerId).join(" or ");
      return {
        error: `This email is linked to a ${providers} account. Please sign in with ${providers} instead, or reset your password to set one.`,
      };
    }
  }

  try {
    await auth.api.signInEmail({
      body: { email, password },
    });
  } catch (error: unknown) {
    return {
      error: error instanceof Error ? error.message : "Failed to sign in",
    };
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

export const forgetPassword = async (email: string) => {
  try {
    await auth.api.requestPasswordReset({
      body: {
        email,
        redirectTo: "/auth/reset-password",
      },
    });
    return { success: true };
  } catch (error: unknown) {
    const message = (error as Error)?.message || "";
    return { error: message || "Something went wrong. Please try again." };
  }
};

export const resetPasswordSubmit = async (password: string, token: string) => {
  try {
    await auth.api.resetPassword({
      body: {
        newPassword: password,
        token,
      },
    });
    return { success: true };
  } catch (error: unknown) {
    const message = (error as Error)?.message || "";
    return {
      error: message || "Failed to reset password. The link may have expired.",
    };
  }
};
