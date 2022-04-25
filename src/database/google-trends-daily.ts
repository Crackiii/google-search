import { Prisma } from "@prisma/client";
import { getPrismaClient } from "../client";
const prisma = getPrismaClient();

export const putGoogleTrends = async (data: Prisma.google_dailyCreateInput) => {
  try {
    await prisma.google_daily.create({data});
  } catch(error) {
    console.log("Error putGoogleDailyTrends: ", error.message);
  }

};