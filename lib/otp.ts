import { prisma } from "@/lib/prisma";
import { resend } from "@/lib/resend";
import { twilioClient, twilioVerifyServiceSid } from "@/lib/twilio";

const OTP_TTL_MINUTES = 10;

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendEmailOtp(userId: string, email: string) {
  const code = generateCode();
  const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);

  // Remove any previous unused codes for this user before issuing a new one.
  await prisma.otpCode.deleteMany({ where: { userId } });
  await prisma.otpCode.create({ data: { userId, code, expiresAt } });

  await resend.emails.send({
    from: process.env.EMAIL_FROM || "Ife Homes <onboarding@resend.dev>",
    to: email,
    subject: "Your Ife Homes verification code",
    html: `<p>Your verification code is:</p><h2 style="letter-spacing:4px;">${code}</h2><p>This code expires in ${OTP_TTL_MINUTES} minutes.</p>`,
  });
}

export async function confirmEmailOtp(userId: string, code: string): Promise<boolean> {
  const record = await prisma.otpCode.findFirst({
    where: { userId, code },
    orderBy: { createdAt: "desc" },
  });
  if (!record) return false;
  if (record.expiresAt < new Date()) return false;

  await prisma.otpCode.deleteMany({ where: { userId } });
  return true;
}

export async function sendPhoneOtp(phone: string) {
  if (!twilioClient || !twilioVerifyServiceSid) {
    throw new Error("Phone verification isn't configured on this server yet.");
  }
  await twilioClient.verify.v2
    .services(twilioVerifyServiceSid)
    .verifications.create({ to: phone, channel: "sms" });
}

export async function confirmPhoneOtp(phone: string, code: string): Promise<boolean> {
  if (!twilioClient || !twilioVerifyServiceSid) {
    throw new Error("Phone verification isn't configured on this server yet.");
  }
  const check = await twilioClient.verify.v2
    .services(twilioVerifyServiceSid)
    .verificationChecks.create({ to: phone, code });
  return check.status === "approved";
}
