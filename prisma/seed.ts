import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const slots = [
    { valorNota: 2, quantidade: 20 },
    { valorNota: 5, quantidade: 20 },
    { valorNota: 10, quantidade: 20 },
    { valorNota: 20, quantidade: 10 },
    { valorNota: 50, quantidade: 5 },
    { valorNota: 100, quantidade: 3 },
    { valorNota: 200, quantidade: 1 },
  ];
  for (const s of slots) {
    await prisma.slotNotas.upsert({
      where: { valorNota: s.valorNota },
      update: {},
      create: s,
    });
  }
}

main().finally(() => prisma.$disconnect());