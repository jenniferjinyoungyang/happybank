import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

declare global {
  var prisma: PrismaClient | undefined;
}

let prisma: PrismaClient;

const datasourceUrl = process.env.POSTGRES_PRISMA_URL;

if (!datasourceUrl) {
  throw new Error("POSTGRES_PRISMA_URL environment variable is not set");
}

const adapter = new PrismaPg({ connectionString: datasourceUrl });

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient({ adapter });
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient({ adapter });
  }
  prisma = global.prisma;
}

export default prisma;
