import { Prisma } from "@prisma/client";
import { getPrismaClient } from "../client";
const prisma = getPrismaClient();

export const putGoogleTrends = async (data: Prisma.google_realtimeCreateInput) => {
  try {
    await prisma.google_realtime.create({data});
  } catch(error) {
    console.log("Error putGoogleRealtimeTrends: ", error.message);
  }

};