import { eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";

import db from "@/db/drizzle";
import { lessons } from "@/db/schema";

export const GET = async (
  _req: NextRequest,
  { params }: { params: Promise<{ lessonId: number }> }
) => {
  const { lessonId } = await params;
  const data = await db.query.lessons.findFirst({
    where: eq(lessons.id, lessonId),
  });

  return NextResponse.json(data);
};

export const PUT = async (
  req: NextRequest,
  { params }: { params: Promise<{ lessonId: number }> }
) => {
  const { lessonId } = await params;
  const body = (await req.json()) as typeof lessons.$inferSelect;
  const data = await db
    .update(lessons)
    .set({
      ...body,
    })
    .where(eq(lessons.id, lessonId))
    .returning();

  return NextResponse.json(data[0]);
};

export const DELETE = async (
  _req: NextRequest,
  { params }: { params: Promise<{ lessonId: number }> }
) => {
  const { lessonId } = await params;
  const data = await db
    .delete(lessons)
    .where(eq(lessons.id, lessonId))
    .returning();

  return NextResponse.json(data[0]);
};
