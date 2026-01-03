import { eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";

import db from "@/db/drizzle";
import { units } from "@/db/schema";

export const GET = async (
  _req: NextRequest,
  { params }: { params: Promise<{ unitId: number }> }
) => {
  const { unitId } = await params;
  const data = await db.query.units.findFirst({
    where: eq(units.id, unitId),
  });

  return NextResponse.json(data);
};

export const PUT = async (
  req: NextRequest,
  { params }: { params: Promise<{ unitId: number }> }
) => {
  const { unitId } = await params;
  const body = (await req.json()) as typeof units.$inferSelect;
  const data = await db
    .update(units)
    .set({
      ...body,
    })
    .where(eq(units.id, unitId))
    .returning();

  return NextResponse.json(data[0]);
};

export const DELETE = async (
  _req: NextRequest,
  { params }: { params: Promise<{ unitId: number }> }
) => {
  const { unitId } = await params;
  const data = await db
    .delete(units)
    .where(eq(units.id, unitId))
    .returning();

  return NextResponse.json(data[0]);
};
