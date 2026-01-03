import { eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";

import db from "@/db/drizzle";
import { challenges } from "@/db/schema";

export const GET = async (
  _req: NextRequest,
  { params }: { params: Promise<{ challengeId: number }> }
) => {
  const { challengeId } = await params;
  const data = await db.query.challenges.findFirst({
    where: eq(challenges.id, challengeId),
  });

  return NextResponse.json(data);
};

export const PUT = async (
  req: NextRequest,
  { params }: { params: Promise<{ challengeId: number }> }
) => {
  const { challengeId } = await params;
  const body = (await req.json()) as typeof challenges.$inferSelect;
  const data = await db
    .update(challenges)
    .set({
      ...body,
    })
    .where(eq(challenges.id, challengeId))
    .returning();

  return NextResponse.json(data[0]);
};

export const DELETE = async (
  _req: NextRequest,
  { params }: { params: Promise<{ challengeId: number }> }
) => {
  const { challengeId } = await params;
  const data = await db
    .delete(challenges)
    .where(eq(challenges.id, challengeId))
    .returning();

  return NextResponse.json(data[0]);
};
