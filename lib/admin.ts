import { auth } from "@clerk/nextjs/server";

const adminIds = (process.env.ADMIN_IDS || "").split(",");

export const isAdmin = async () => {
    const { userId } = await auth();

    if (!userId) {
        return false;
    }

    return adminIds.includes(userId);
};

