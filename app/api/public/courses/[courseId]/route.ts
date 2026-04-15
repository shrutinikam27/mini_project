import { eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";

import db from "db/drizzle";
import { courses } from "db/schema";

export const dynamic = "force-dynamic";


export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ courseId: string }> }
) {
    const { courseId } = await params;
    const id = Number(courseId);

    if (isNaN(id)) {
        return new NextResponse("Invalid course ID", { status: 400 });
    }

    const data = await db.query.courses.findFirst({
        where: eq(courses.id, id),
    });

    if (!data) {
        return new NextResponse("Course not found", { status: 404 });
    }

    return NextResponse.json(data);
};
