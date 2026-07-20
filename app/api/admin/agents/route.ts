import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user.isAdmin) return NextResponse.json({ error: "Admins only." }, { status: 403 });

  const agents = await prisma.user.findMany({
    where: { role: "AGENT" },
    select: { id: true, name: true, email: true, phone: true, agentPaymentStatus: true, agentPaidAt: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(agents);
}
