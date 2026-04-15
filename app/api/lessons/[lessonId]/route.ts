import { eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import createError, { isHttpError } from "http-errors";

import db from "db/drizzle";
import { lessons } from "db/schema";
import { isAdmin } from "lib/admin";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    if (!await isAdmin()) {
      throw createError(403, "Forbidden");
    }

    const { lessonId } = await params;
    const id = Number(lessonId);
    const data = await db.query.lessons.findFirst({
      where: eq(lessons.id, id),
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
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    if (!await isAdmin()) {
      throw createError(403, "Forbidden");
    }

    const { lessonId } = await params;
    const id = Number(lessonId);
    const body = (await req.json()) as typeof lessons.$inferSelect;
    const data = await db
      .update(lessons)
      .set({
        ...body,
      })
      .where(eq(lessons.id, id))
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
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    if (!await isAdmin()) {
      throw createError(403, "Forbidden");
    }

    const { lessonId } = await params;
    const id = Number(lessonId);
    const data = await db
      .delete(lessons)
      .where(eq(lessons.id, id))
      .returning();

    return NextResponse.json(data[0]);
  } catch (error: any) {
    if (isHttpError(error)) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

