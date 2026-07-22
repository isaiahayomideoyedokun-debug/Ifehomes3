import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const faculty = searchParams.get("faculty");
  const gender = searchParams.get("gender");
  const minBudget = searchParams.get("minBudget");
  const maxBudget = searchParams.get("maxBudget");

  const roommates = await prisma.user.findMany({
    where: {
      role: "STUDENT",
      faculty: { not: null },
      lookingForRoommate: true,
      ...(faculty && faculty !== "all" ? { faculty } : {}),
      ...(gender && gender !== "any" ? { gender } : {}),
      ...(minBudget || maxBudget
        ? {
            budget: {
              ...(minBudget ? { gte: Number(minBudget) } : {}),
              ...(maxBudget ? { lt: Number(maxBudget) } : {}),
            },
          }
        : {}),
    },
    select: {
      id: true,
      name: true,
      level: true,
      faculty: true,
      gender: true,
      budget: true,
      tags: true,
      bio: true,
      phone: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(roommates);
}
