import { eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import createError, { isHttpError } from "http-errors";

import db from "db/drizzle";
import { challengeOptions } from "db/schema";
import { isAdmin } from "lib/admin";

export const GET = async (
  _req: NextRequest,
  { params }: { params: Promise<{ challengeOptionId: string }> }
) => {
  try {
    if (!await isAdmin()) {
      throw createError(403, "Forbidden");
    }

    const { challengeOptionId } = await params;
    const id = Number(challengeOptionId);
    const data = await db.query.challengeOptions.findFirst({
      where: eq(challengeOptions.id, id),
    });

    return NextResponse.json(data);
  } catch (error: any) {
    if (isHttpError(error)) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};

export const PUT = async (
  req: NextRequest,
  { params }: { params: Promise<{ challengeOptionId: string }> }
) => {
  try {
    if (!await isAdmin()) {
      throw createError(403, "Forbidden");
    }

    const { challengeOptionId } = await params;
    const id = Number(challengeOptionId);
    const body = (await req.json()) as typeof challengeOptions.$inferSelect;
    const data = await db
      .update(challengeOptions)
      .set({
        ...body,
      })
      .where(eq(challengeOptions.id, id))
      .returning();

    return NextResponse.json(data[0]);
  } catch (error: any) {
    if (isHttpError(error)) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};

export const DELETE = async (
  _req: NextRequest,
  { params }: { params: Promise<{ challengeOptionId: string }> }
) => {
  try {
    if (!await isAdmin()) {
      throw createError(403, "Forbidden");
    }

    const { challengeOptionId } = await params;
    const id = Number(challengeOptionId);
    const data = await db
      .delete(challengeOptions)
      .where(eq(challengeOptions.id, id))
      .returning();

    return NextResponse.json(data[0]);
  } catch (error: any) {
    if (isHttpError(error)) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};

