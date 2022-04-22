import { Prisma } from "@prisma/client";
import { getPrismaClient } from "../client";
const prisma = getPrismaClient();

export const putDuckDuckGoTrends = async (data: Prisma.duckduckgoCreateInput) => {
  try {
    await prisma.duckduckgo.create({data});
  } catch(error) {
    console.log("Error putDuckDuckGoTrends: ", error.message);
  }

};