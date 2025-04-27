import { type NextRequest, NextResponse } from "next/server";
import { HttpError } from "http-errors";

import db from "db/drizzle";
import { challenges } from "db/schema";
import { getIsAdmin } from "lib/admin";

export const GET = async () => {
  try {
    const isAdmin = await getIsAdmin();
    if (!isAdmin) throw new HttpError(401, "Unauthorized.");

    const data = await db.query.challenges.findMany();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in GET /challenges:", error);
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
    if (error instanceof HttpError) {
      return NextResponse.json({ message: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};
