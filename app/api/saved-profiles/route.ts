import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json([]);
  const saved = await prisma.savedProfile.findMany({
    where: { ownerId: session.user.id },
    include: { target: true },
  });
  return NextResponse.json(saved.map((s) => s.target));
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Sign in required." }, { status: 401 });

  const { targetId } = await req.json();
  if (targetId === session.user.id) {
    return NextResponse.json({ error: "You can't save your own profile." }, { status: 400 });
  }
  const existing = await prisma.savedProfile.findUnique({
    where: { ownerId_targetId: { ownerId: session.user.id, targetId } },
  });

  if (existing) {
    await prisma.savedProfile.delete({ where: { id: existing.id } });
    return NextResponse.json({ saved: false });
  }
  await prisma.savedProfile.create({ data: { ownerId: session.user.id, targetId } });
  return NextResponse.json({ saved: true });
}
