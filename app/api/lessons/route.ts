import { type NextRequest, NextResponse } from "next/server";
import { HttpError } from "http-errors"; // Consider installing @types/http-errors for better typing

import db from "db/drizzle";
import { lessons } from "db/schema";
import { getIsAdmin } from "lib/admin";

export const GET = async () => {
  try {
    const isAdmin = await getIsAdmin();
    if (!isAdmin) throw new HttpError(401, "Unauthorized.");

    const data = await db.query.lessons.findMany();

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error in GET /lessons:", error);
    if (error instanceof HttpError) {
      return NextResponse.json({ message: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const isAdmin = await getIsAdmin();
    if (!isAdmin) throw new HttpError(401, "Unauthorized.");

    const body = (await req.json()) as typeof lessons.$inferSelect;

    const data = await db
      .insert(lessons)
      .values({
        ...body,
      })
      .returning();

    return NextResponse.json(data[0]);
  } catch (error: any) {
    console.error("Error in POST /lessons:", error);
    if (error instanceof HttpError) {
      return NextResponse.json({ message: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};
