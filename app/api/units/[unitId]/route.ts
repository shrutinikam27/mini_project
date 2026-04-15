import { eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import createError, { isHttpError } from "http-errors";

import db from "db/drizzle";
import { units } from "db/schema";
import { isAdmin } from "lib/admin";

export const GET = async (
  _req: NextRequest,
  { params }: { params: Promise<{ unitId: string }> }
) => {
  try {
    if (!await isAdmin()) {
      throw createError(403, "Forbidden");
    }

    const { unitId } = await params;
    const id = Number(unitId);

    const data = await db.query.units.findFirst({
      where: eq(units.id, id),
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
  { params }: { params: Promise<{ unitId: string }> }
) => {
  try {
    if (!await isAdmin()) {
      throw createError(403, "Forbidden");
    }

    const { unitId } = await params;
    const id = Number(unitId);
    const body = (await req.json()) as typeof units.$inferSelect;

    const data = await db
      .update(units)
      .set({
        ...body,
      })
      .where(eq(units.id, id))
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
  { params }: { params: Promise<{ unitId: string }> }
) => {
  try {
    if (!await isAdmin()) {
      throw createError(403, "Forbidden");
    }

    const { unitId } = await params;
    const id = Number(unitId);

    const data = await db
      .delete(units)
      .where(eq(units.id, id))
      .returning();

    return NextResponse.json(data[0]);
  } catch (error: any) {
    if (isHttpError(error)) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};

