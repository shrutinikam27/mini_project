import { auth } from "@clerk/nextjs";

export const getIsAdmin = async () => {
  try {
    const { userId } = await auth();

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
