import { eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import createError, { isHttpError } from "http-errors";

import db from "db/drizzle";
import { courses } from "db/schema";
import { isAdmin } from "lib/admin";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ courseId: string }> }) {
  try {
    if (!await isAdmin()) {
      throw createError(403, "Forbidden");
    }

    const { courseId } = await params;
    const id = Number(courseId);

    const data = await db.query.courses.findFirst({
      where: eq(courses.id, id),
    });

    return NextResponse.json(data);
  } catch (error: any) {
    if (isHttpError(error)) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ courseId: string }> }) {
  try {
    if (!await isAdmin()) {
      throw createError(403, "Forbidden");
    }

    const { courseId } = await params;
    const id = Number(courseId);

    if (isNaN(id)) {
      throw createError(400, "Invalid course ID");
    }

    const body = (await req.json()) as typeof courses.$inferSelect;

    const data = await db
      .update(courses)
      .set({ ...body })
      .where(eq(courses.id, id))
      .returning();

    return NextResponse.json(data[0]);
  } catch (error: any) {
    if (isHttpError(error)) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ courseId: string }> }) {
  try {
    if (!await isAdmin()) {
      throw createError(403, "Forbidden");
    }

    const { courseId } = await params;
    const id = Number(courseId);

    if (isNaN(id)) {
      throw createError(400, "Invalid course ID");
    }

    const data = await db
      .delete(courses)
      .where(eq(courses.id, id))
      .returning();

    return NextResponse.json(data[0]);
  } catch (error: any) {
    if (isHttpError(error)) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

