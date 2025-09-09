import { env } from "@/env";
import nodemailer from "nodemailer";

type SendOtpEmailArgs = { to: string; name?: string; otp: string };

export async function sendOtpEmail({ to, name, otp }: SendOtpEmailArgs) {
  // Transporter for Gmail SMTP. We recommend using an App Password (preferred)
  // Env vars required: GMAIL_USER, GMAIL_PASS
  const GMAIL_USER = env.GMAIL_USER;
  const GMAIL_PASS = env.GMAIL_PASS;
  if (!GMAIL_USER || !GMAIL_PASS) {
    throw new Error("GMAIL_USER or GMAIL_PASS not configured in environment");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"الدعم" <${GMAIL_USER}>`,
    to,
    subject: "رمز التحقق - إعادة تعيين كلمة المرور",
    text: `مرحباً ${name ?? ""}\n\nرمز إعادة التعيين الخاص بك هو: ${otp}\nهذا الرمز صالح لمدة 10 دقائق.\n\nإذا لم تطلب إعادة تعيين كلمة المرور، فتجاهل هذه الرسالة.`,
    html: `<p>مرحباً ${name ?? ""},</p>
           <p>رمز إعادة التعيين الخاص بك هو: <b>${otp}</b></p>
           <p>هذا الرمز صالح لمدة 10 دقائق.</p>
           <p>إذا لم تطلب إعادة تعيين كلمة المرور، فتجاهل هذه الرسالة.</p>`,
  };

  await transporter.sendMail(mailOptions);
}
