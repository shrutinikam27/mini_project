import { type NextRequest, NextResponse } from "next/server";

import db from "db/drizzle";
import { units } from "db/schema";

export const GET = async () => {
  try {
    const data = await db.query.units.findMany();

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error in GET /units:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const body = (await req.json()) as typeof units.$inferSelect;

    const data = await db
      .insert(units)
      .values({
        ...body,
      })
      .returning();

    return NextResponse.json(data[0]);
  } catch (error: any) {
    console.error("Error in POST /units:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};
