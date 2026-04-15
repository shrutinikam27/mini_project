import { eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";

import db from "@/db/drizzle";
import { lessons } from "@/db/schema";

export async function GET(
    req: NextRequest,
) {
    try {
        const { searchParams } = new URL(req.url);
        const lessonId = searchParams.get("lessonId");
        
        if (!lessonId) {
            return NextResponse.json({ error: "lessonId is required" }, { status: 400 });
        }

        const id = Number(lessonId);
        const data = await db.query.lessons.findFirst({
            where: eq(lessons.id, id),
        });

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}


export async function PUT(
    req: NextRequest,
) {
    try {
        const { searchParams } = new URL(req.url);
        const lessonId = searchParams.get("lessonId");

        if (!lessonId) {
            return NextResponse.json({ error: "lessonId is required" }, { status: 400 });
        }

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
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
) {
    try {
        const { searchParams } = new URL(req.url);
        const lessonId = searchParams.get("lessonId");

        if (!lessonId) {
            return NextResponse.json({ error: "lessonId is required" }, { status: 400 });
        }

        const id = Number(lessonId);
        const data = await db
            .delete(lessons)
            .where(eq(lessons.id, id))
            .returning();

        return NextResponse.json(data[0]);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
