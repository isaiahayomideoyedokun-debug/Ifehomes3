import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user.isAdmin) return NextResponse.json({ error: "Admins only." }, { status: 403 });

  const { agentId, status } = await req.json();
  const nextStatus = status === "unpaid" ? "unpaid" : "paid";

  const updated = await prisma.user.update({
    where: { id: agentId },
    data: {
      agentPaymentStatus: nextStatus,
      agentPaidAt: nextStatus === "paid" ? new Date() : null,
    },
  });
  return NextResponse.json({ id: updated.id, agentPaymentStatus: updated.agentPaymentStatus });
}
