import type { NextRequest } from "next/server";
import { getAuth } from "@clerk/nextjs/server";

export const getIsAdmin = async (req: NextRequest) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) return false;

    const adminIdsEnv = process.env.CLERK_ADMIN_IDS;
    if (!adminIdsEnv) {
      console.error("CLERK_ADMIN_IDS environment variable is not set");
      return false;
    }

    const adminIds = adminIdsEnv.split(", ");

    return adminIds.includes(userId);
  } catch (error) {
    console.error("Error in getIsAdmin:", error);
    return false;
  }
};
