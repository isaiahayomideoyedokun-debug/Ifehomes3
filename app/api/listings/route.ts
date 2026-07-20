import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const area = searchParams.get("area"); // free-text, matched as "contains"
  const type = searchParams.get("type");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");

  const listings = await prisma.listing.findMany({
    where: {
      ...(area ? { area: { contains: area, mode: "insensitive" } } : {}),
      ...(type && type !== "any" ? { type } : {}),
      ...(minPrice || maxPrice
        ? {
            price: {
              ...(minPrice ? { gte: Number(minPrice) } : {}),
              ...(maxPrice ? { lt: Number(maxPrice) } : {}),
            },
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    include: { agent: { select: { name: true, phone: true } } },
  });

  return NextResponse.json(listings);
}

const createSchema = z.object({
  title: z.string().min(3),
  area: z.string().min(2),
  type: z.string().min(2),
  price: z.number().positive(),
  badge: z.string().optional(),
  description: z.string().optional(),
  amenities: z.string().optional(),
  images: z.string().optional(),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "AGENT") {
    return NextResponse.json({ error: "Only agents can create listings." }, { status: 403 });
  }
  if (session.user.agentPaymentStatus !== "paid") {
    return NextResponse.json(
      { error: "Your annual agent plan isn't active yet. Complete payment on the Billing page first." },
      { status: 402 }
    );
  }

  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check the listing details." }, { status: 400 });
  }

  const listing = await prisma.listing.create({
    data: { ...parsed.data, agentId: session.user.id },
  });

  return NextResponse.json(listing);
}
