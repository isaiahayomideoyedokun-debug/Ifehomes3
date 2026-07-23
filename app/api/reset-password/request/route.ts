import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmailOtp } from "@/lib/otp";

export async function POST(req: Request) {
  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: "Email required." }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
  if (!user) return NextResponse.json({ error: "No account found with that email." }, { status: 404 });

  try {
    await sendEmailOtp(user.id, user.email);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Couldn't send the code. Please try again shortly." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}