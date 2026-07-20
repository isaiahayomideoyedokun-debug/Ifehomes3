import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { confirmEmailOtp, confirmPhoneOtp } from "@/lib/otp";

export async function POST(req: Request) {
  const { email, code } = await req.json();
  if (!email || !code) return NextResponse.json({ error: "Email and code required." }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
  if (!user) return NextResponse.json({ error: "No account found with that email." }, { status: 404 });
  if (user.verified) return NextResponse.json({ ok: true, alreadyVerified: true });

  let ok = false;
  try {
    if (user.verifyChannel === "phone" && user.phone) {
      ok = await confirmPhoneOtp(user.phone, code);
    } else {
      ok = await confirmEmailOtp(user.id, code);
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Couldn't check that code. Please try again." }, { status: 500 });
  }

  if (!ok) return NextResponse.json({ error: "That code is incorrect or has expired." }, { status: 400 });

  await prisma.user.update({ where: { id: user.id }, data: { verified: true } });
  return NextResponse.json({ ok: true });
}
