import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) => {
  const { error } = await resend.emails.send({
    from: "RYUK <onboarding@resend.dev>", // 👈 use this until you have a custom domain
    to,
    subject,
    html,
  });

  if (error) {
    console.error("Email send error:", error);
    throw new Error("Failed to send email");
  }
};