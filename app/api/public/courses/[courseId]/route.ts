import { eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";

import db from "db/drizzle";
import { courses } from "db/schema";

export const GET = async (
    _req: NextRequest,
    { params }: { params: { courseId: number } }
) => {
    const data = await db.query.courses.findFirst({
        where: eq(courses.id, params.courseId),
    });

    if (!data) {
        return new NextResponse("Course not found", { status: 404 });
    }

    return NextResponse.json(data);
};
