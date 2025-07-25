// ensure the file exists at src/lib/admin.ts

import { challengeOptions } from "/db/schema";
import { type NextRequest, NextResponse } from "next/server";
import db from "db/drizzle";
import { getIsAdmin } from "lib/admin";

export const GET = async () => {
  try {
    const isAdmin = await getIsAdmin(); // ✅ must be async

    if (!isAdmin) {
      return new NextResponse("Unauthorized.", { status: 401 });
    }

    const data = await db.query.challengeOptions.findMany();

    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /challengeOptions error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const isAdmin = await getIsAdmin();

    if (!isAdmin) {
      return new NextResponse("Unauthorized.", { status: 401 });
    }

    const body = (await req.json()) as typeof challengeOptions.$inferInsert; // Prefer $inferInsert for POST

    const data = await db
      .insert(challengeOptions)
      .values({
        ...body,
      })
      .returning();

    return NextResponse.json(data[0]);
  } catch (error) {
    console.error("POST /challengeOptions error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
