import "dotenv/config";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (
  email: string,
  name: string,
  verificationToken: string
) => {
  const verificationUrl =
    `http://localhost:5173/verify-email?token=${verificationToken}`;

  const result = await resend.emails.send({
    from: "AI Career Assistant <onboarding@resend.dev>",
    to: email,
    subject: "Verify your email",
    html: `
      <h2>Welcome to AI Career Assistant, ${name}!</h2>

      <p>Please verify your email address.</p>

      <a
        href="${verificationUrl}"
        style="
          display:inline-block;
          padding:12px 20px;
          background:#2563eb;
          color:white;
          text-decoration:none;
          border-radius:6px;
        "
      >
        Verify Email
      </a>

      <p>This link will expire in 15 minutes.</p>
    `,
  });

  if (result.error) {
    throw new Error(`Resend email failed: ${result.error.message}`);
  }

  console.log("Resend result:", result);

  return result;
};