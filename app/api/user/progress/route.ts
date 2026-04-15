import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getUserProgress } from "db/queries";

export const dynamic = "force-dynamic";


export async function GET() {
    const authData = await auth();
    const userId = authData.userId;
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const progress = await getUserProgress();
        if (!progress) {
            return NextResponse.json({ error: "User progress not found" }, { status: 404 });
        }
        return NextResponse.json(progress);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch user progress" }, { status: 500 });
    }
}
