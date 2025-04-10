
"use server";

import { auth, currentUser, User } from "@clerk/nextjs/server";
import db from "@/db/drizzle";
import { getCoursesById, getUserProgress } from "db/queries";
import { userProgress } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const upsertUserProgress = async (courseId: number) => {
    const { userId } = await auth();
    const user = await currentUser();
    if (!userId || !user) {
        throw new Error("Unauthorized.");
    }


    const course = await getCoursesById(courseId);

    if (!course) {
        throw new Error("Course not found");
    }
    // TODO: Add units/lessons validation when available
    // if (!course.units?.length || !course.units[0]?.lessons?.length) {
    //     throw new Error("Course is empty - no units or lessons available");
    // }
    const existingUserProgress = await getUserProgress();
    if (existingUserProgress) {
        await db.update(userProgress).set({
            activeCourseId: courseId,
            userName: user.firstName || "User",
            userImageSrc: user.imageUrl || "/logo1.png",
        });
        revalidatePath("/courses");
        revalidatePath("/learn");
        redirect("/learn");
    }
    await db.insert(userProgress).values({
        userId,
        activeCourseId: courseId,
        userName: user.firstName || "User",
        userImageSrc: user.imageUrl || "/logo1.png",
    });
    revalidatePath("/courses");
    revalidatePath("/learn");
    redirect("/learn");
}

