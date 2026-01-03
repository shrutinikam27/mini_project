import { type NextRequest, NextResponse } from "next/server";

import db from "db/drizzle";
import { challenges } from "db/schema";

export const GET = async () => {
  try {
    const data = await db.query.challenges.findMany();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in GET /challenges:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const body = (await req.json()) as typeof challenges.$inferSelect;

    const data = await db
      .insert(challenges)
      .values({
        ...body,
      })
      .returning();

    return NextResponse.json(data[0]);
  } catch (error) {
    console.error("Error in POST /challenges:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};
