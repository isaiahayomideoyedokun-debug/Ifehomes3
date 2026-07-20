import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendEmailOtp, sendPhoneOtp } from "@/lib/otp";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  password: z.string().min(6),
  role: z.enum(["STUDENT", "AGENT"]),
  verifyChannel: z.enum(["email", "phone"]),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check your details and try again." }, { status: 400 });
  }
  const { name, email, phone, password, role, verifyChannel } = parsed.data;
  const normalizedEmail = email.toLowerCase().trim();

  const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (existing) {
    return NextResponse.json({ error: "An account with that email already exists." }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email: normalizedEmail, phone, passwordHash, role, verifyChannel },
  });

  try {
    if (verifyChannel === "email") {
      await sendEmailOtp(user.id, user.email);
    } else {
      await sendPhoneOtp(phone);
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Account created, but we couldn't send the verification code. Try resending it from the verify page." },
      { status: 200, headers: { "X-Signup-Warning": "otp-send-failed" } }
    );
  }

  return NextResponse.json({ id: user.id, email: user.email, verifyChannel });
}
