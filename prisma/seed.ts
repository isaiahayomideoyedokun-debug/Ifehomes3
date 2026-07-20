import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);

  const agent = await prisma.user.upsert({
    where: { email: "agent@ifehomes.test" },
    update: {},
    create: {
      name: "Adewale Properties",
      email: "agent@ifehomes.test",
      phone: "2348030000001",
      passwordHash,
      role: "AGENT",
      verified: true,
      verifyChannel: "email",
      agentPaymentStatus: "paid", // demo agent starts pre-paid so listings work out of the box
    },
  });

  const student1 = await prisma.user.upsert({
    where: { email: "tolu@ifehomes.test" },
    update: {},
    create: {
      name: "Tolu Adewale",
      email: "tolu@ifehomes.test",
      phone: "2348030000002",
      passwordHash,
      role: "STUDENT",
      verified: true,
      verifyChannel: "email",
      level: "300L",
      faculty: "Sciences",
      gender: "M",
      budget: 125000,
      tags: "Early riser,Quiet,Non-smoker",
      bio: "Microbiology student, usually in the library by 7am.",
    },
  });

  await prisma.user.upsert({
    where: { email: "bisi@ifehomes.test" },
    update: {},
    create: {
      name: "Bisi Okafor",
      email: "bisi@ifehomes.test",
      phone: "2348030000003",
      passwordHash,
      role: "STUDENT",
      verified: true,
      verifyChannel: "email",
      level: "200L",
      faculty: "Law",
      gender: "F",
      budget: 185000,
      tags: "Night reader,Social",
      bio: "Law student, moot court on weekends, easygoing.",
    },
  });

  await prisma.listing.createMany({
    data: [
      {
        title: "Self-contain, Road 1",
        area: "Road 1",
        type: "selfcon",
        price: 180000,
        badge: "Verified",
        description: "Bright self-contain a five minute walk from the main gate.",
        amenities: "Ensuite,Prepaid meter,Wifi ready",
        agentId: agent.id,
      },
      {
        title: "2-bedroom flat, Mayfair",
        area: "Mayfair",
        type: "2bed",
        price: 320000,
        badge: "New",
        description: "Gated compound with 24hr security, great for two roommates.",
        amenities: "Parking,Water tank,Furnished",
        agentId: agent.id,
      },
      {
        title: "Shared room, Lagere",
        area: "Lagere",
        type: "shared",
        price: 95000,
        description: "Budget-friendly shared room, three minutes to the shuttle stop.",
        amenities: "Wifi ready,Kitchenette",
        agentId: agent.id,
      },
    ],
    skipDuplicates: true,
  });

  console.log("Seeded:", { agent: agent.email, student1: student1.email });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
