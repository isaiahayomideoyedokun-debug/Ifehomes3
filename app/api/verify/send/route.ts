import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmailOtp, sendPhoneOtp } from "@/lib/otp";

function maskEmail(email: string) {
  const [user, domain] = email.split("@");
  return `${user.slice(0, 2)}${"*".repeat(Math.max(user.length - 2, 1))}@${domain}`;
}
function maskPhone(phone: string) {
  return phone.slice(0, -4).replace(/\d/g, "*") + phone.slice(-4);
}

export async function POST(req: Request) {
  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: "Email required." }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
  if (!user) return NextResponse.json({ error: "No account found with that email." }, { status: 404 });
  if (user.verified) return NextResponse.json({ error: "This account is already verified." }, { status: 400 });

  try {
    if (user.verifyChannel === "phone" && user.phone) {
      await sendPhoneOtp(user.phone);
      return NextResponse.json({ channel: "phone", contact: maskPhone(user.phone) });
    } else {
      await sendEmailOtp(user.id, user.email);
      return NextResponse.json({ channel: "email", contact: maskEmail(user.email) });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Couldn't send the code. Please try again shortly." }, { status: 500 });
  }
}
