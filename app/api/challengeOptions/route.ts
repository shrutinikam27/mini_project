import { type NextRequest, NextResponse } from "next/server";
import createError, { isHttpError } from "http-errors";

import db from "db/drizzle";
import { challengeOptions } from "db/schema";
import { isAdmin } from "lib/admin";

export const GET = async () => {
  try {
    if (!await isAdmin()) {
      throw createError(403, "Forbidden");
    }

    const data = await db.query.challengeOptions.findMany();

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("GET /challengeOptions error:", error);
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

    const body = (await req.json()) as typeof challengeOptions.$inferInsert;

    const data = await db
      .insert(challengeOptions)
      .values({
        ...body,
      })
      .returning();

    return NextResponse.json(data[0]);
  } catch (error: any) {
    console.error("POST /challengeOptions error:", error);
    if (isHttpError(error)) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};

