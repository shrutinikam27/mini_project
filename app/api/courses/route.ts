import { type NextRequest, NextResponse } from "next/server";
import createError, { isHttpError } from "http-errors";

import db from "db/drizzle";
import { courses } from "db/schema";
import { isAdmin } from "lib/admin";

export const GET = async () => {
  try {
    if (!await isAdmin()) {
      throw createError(403, "Forbidden");
    }

    const data = await db.query.courses.findMany();

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error in GET /courses:", error);
    if (isHttpError(error)) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};

export const POST = async (req: NextRequest) => {
  try {
    if (!await isAdmin()) {
      throw createError(403, "Forbidden");
    }

    const body = (await req.json()) as typeof courses.$inferSelect;

    const data = await db
      .insert(courses)
      .values({
        ...body,
      })
      .returning();

    return NextResponse.json(data[0]);
  } catch (error: any) {
    console.error("Error in POST /courses:", error);
    if (isHttpError(error)) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};

