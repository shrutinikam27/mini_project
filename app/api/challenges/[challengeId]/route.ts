import { eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import createError, { isHttpError } from "http-errors";

import db from "db/drizzle";
import { challenges } from "db/schema";
import { isAdmin } from "lib/admin";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ challengeId: string }> }
) {
  try {
    if (!await isAdmin()) {
      throw createError(403, "Forbidden");
    }

    const { challengeId } = await params;
    const id = Number(challengeId);
    const data = await db.query.challenges.findFirst({
      where: eq(challenges.id, id),
    });

    return NextResponse.json(data);
  } catch (error: any) {
    if (isHttpError(error)) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ challengeId: string }> }
) {
  try {
    if (!await isAdmin()) {
      throw createError(403, "Forbidden");
    }

    const { challengeId } = await params;
    const id = Number(challengeId);
    const body = (await req.json()) as typeof challenges.$inferSelect;
    const data = await db
      .update(challenges)
      .set({
        ...body,
      })
      .where(eq(challenges.id, id))
      .returning();

    return NextResponse.json(data[0]);
  } catch (error: any) {
    if (isHttpError(error)) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ challengeId: string }> }
) {
  try {
    if (!await isAdmin()) {
      throw createError(403, "Forbidden");
    }

    const { challengeId } = await params;
    const id = Number(challengeId);
    const data = await db
      .delete(challenges)
      .where(eq(challenges.id, id))
      .returning();

    return NextResponse.json(data[0]);
  } catch (error: any) {
    if (isHttpError(error)) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

