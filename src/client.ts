import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient = null;

export const getPrismaClient = () => {
  if (!prisma) {
    console.log("[PRISMA CLIENT]: Created DB connection.");
    prisma = new PrismaClient();
  }
  console.log("[PRISMA CLIENT]: Returning DB connection.");
  return prisma;
};
