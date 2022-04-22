import { Prisma } from "@prisma/client";
import { getPrismaClient } from "../client";
const prisma = getPrismaClient();

export const putGoogleTrends = async (data: Prisma.googleCreateInput) => {
  try {
    await prisma.google.create({data});
  } catch(error) {
    console.log("Error putGoogleTrends: ", error.message);
  }

};