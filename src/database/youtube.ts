import { Prisma } from "@prisma/client";
import { getPrismaClient } from "../client";
const prisma = getPrismaClient();

export const putYoutubeTrends = async (data: Prisma.youtubeCreateInput) => {
  try {
    await prisma.youtube.create({data});
  } catch(error) {
    console.log("Error putYoutubeTrends: ", error.message);
  }

};