import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json([]);
  const saved = await prisma.savedListing.findMany({
    where: { userId: session.user.id },
    include: { listing: true },
  });
  return NextResponse.json(saved.map((s) => s.listing));
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Sign in required." }, { status: 401 });

  const { listingId } = await req.json();
  const existing = await prisma.savedListing.findUnique({
    where: { userId_listingId: { userId: session.user.id, listingId } },
  });

  if (existing) {
    await prisma.savedListing.delete({ where: { id: existing.id } });
    return NextResponse.json({ saved: false });
  }
  await prisma.savedListing.create({ data: { userId: session.user.id, listingId } });
  return NextResponse.json({ saved: true });
}
