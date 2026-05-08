import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { nextCookies } from "better-auth/next-js";
import { sendEmail } from "./email";
import {
  verificationEmailTemplate,
  resetPasswordEmailTemplate,
  welcomeEmailTemplate,
} from "./email-templates";

export const auth = betterAuth({
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Verify your email address",
        html: verificationEmailTemplate(url, user.name),
      });
    },
    sendOnSignUp: true,
    afterEmailVerification: async (user) => {
      await sendEmail({
        to: user.email,
        subject: "Welcome to RYUK 🎉",
        html: welcomeEmailTemplate(user.name),
      });
    },
  },

  database: prismaAdapter(prisma, {
    provider: "sqlite",
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Reset your RYUK password",
        html: resetPasswordEmailTemplate(url, user.name),
      });
    },
  },
  socialProviders: {
    google: {
      enabled: !!process.env.GOOGLE_CLIENT_ID,
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
    github: {
      enabled: !!process.env.GITHUB_CLIENT_ID,
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
  account: {
    accountLinking: {
      enabled: true, // 👈 enables account linking
      trustedProviders: ["google", "github"], //these providers are trusted to link automatically
    },
  },
  plugins: [nextCookies()],
});
