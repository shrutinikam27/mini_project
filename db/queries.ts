import { cache } from "react";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import db from "db/drizzle";

import { courses, userProgress, units, challengeProgress, lessons, userSubscription } from "db/schema";

export const getUserProgressWithActiveLesson = cache(async () => {
    try {
        const { userId } = await auth();

        if (!userId) {
            return null;
        }

        // Fetch user progress with active course and active lesson
        const data = await db.query.userProgress.findFirst({
            where: eq(userProgress.userId, userId),
            with: {
                activeCourse: true,

            },
        });

        return data;
    } catch (error) {
        console.error("Error in getUserProgressWithActiveLesson:", error);
        throw error;
    }
});

export const getUserProgress = cache(async () => {
    try {
        const { userId } = await auth();

        if (!userId) {
            return null;
        }

        const data = await db.query.userProgress.findFirst({
            where: eq(userProgress.userId, userId),
            with: {
                activeCourse: true,
            },
        });
        return data;
    } catch (error) {
        console.error("Error in getUserProgress:", error);
        throw error;
    }
});

export const getUnits = cache(async () => {
    try {
        const { userId } = await auth();
        const userProgress = await getUserProgress();

        if (!userId || !userProgress?.activeCourseId) {
            return [];
        }

        const data = await db.query.units.findMany({
            where: eq(units.courseId, userProgress.activeCourseId),
            with: {
                lessons: {
                    with: {
                        challenges: {
                            with: {
                                challengeProgress: {
                                    where: eq(challengeProgress.userId, userId),
                                }
                            },
                        },
                    },
                },
            },
        });

        const normalizedData = data.map((unit) => {
            const lessonsWithCompletedStatus = unit.lessons.map((lesson) => {

                if (
                    lesson.challenges.length === 0
                ) {
                    return { ...lesson, completed: false };
                }
                const allCompletedChallenges = lesson.challenges.every((challenge) => {
                    return challenge.challengeProgress && challenge.challengeProgress.length > 0
                        && challenge.challengeProgress.every((progress) => progress.completed);

                });

                return { ...lesson, completed: allCompletedChallenges };
            });

            return { ...unit, lessons: lessonsWithCompletedStatus };
        });

        return normalizedData;
    } catch (error) {
        console.error("Error in getUnits:", error);
        throw error;
    }
});

export const getCourses = cache(async () => {
    const data = await db.query.courses.findMany();
    return data;
});

export const getCoursesById = cache(async (courseId: number) => {
    const data = await db.query.courses.findFirst({
        where: eq(courses.id, courseId),
        with: {
            units: {
                with: {
                    lessons: true,
                },
            },
        },
    });

    return data;
});

export const getCourseProgress = cache(async () => {
    const { userId } = await auth();
    const userProgress = await getUserProgress();

    if (!userId || !userProgress?.activeCourseId) {
        return null;
    }

    const unitsInActiveCourse = await db.query.units.findMany({
        orderBy: (units, { asc }) => [asc(units.order)],
        where: eq(units.courseId, userProgress.activeCourseId),
        with: {
            lessons: {
                orderBy: (lessons, { asc }) => [asc(lessons.order)],
                with: {
                    unit: true, // Include unit data here
                    challenges: {
                        orderBy: (challenges, { asc }) => [asc(challenges.order)],
                        with: {
                            challengeProgress: {
                                where: eq(challengeProgress.userId, userId),
                            },
                        },
                    },
                },
            },
        },

    });

    const firstUncompletedLesson = unitsInActiveCourse
        .flatMap((unit) => unit.lessons)
        .find((lesson) => {
            return lesson.challenges.some((challenge) => {
                return !challenge.challengeProgress || challenge.challengeProgress.length === 0 || challenge.challengeProgress.some((progress) => progress.completed === false);
            });
        });

    return {
        activeLesson: firstUncompletedLesson,
        activeLessonId: firstUncompletedLesson?.id,
    };
});

export const getLesson = cache(async (id?: number) => {
    const { userId } = await auth();

    if (!userId) {
        return null;
    }

    const courseProgress = await getCourseProgress();

    const lessonId = id || courseProgress?.activeLessonId;

    if (!userId || !lessonId) {
        return null;
    }

    const data = await db.query.lessons.findFirst({
        where: eq(lessons.id, lessonId),
        with: {
            challenges: {
                orderBy: (challenges, { asc }) => [asc(challenges.order)],
                with: {
                    challengeOptions: true,
                    challengeProgress: {
                        where: eq(challengeProgress.userId, userId),
                    },
                },
            },
        },
    });

    if (!data || !data.challenges) {
        return null;
    }

    const normalizedChallenges = data.challenges.map((challenge) => {
        const completed = challenge.challengeProgress &&
            challenge.challengeProgress.length > 0
            && challenge.challengeProgress.every((progress) => progress.completed)

        return {
            ...challenge,
            completed,
        };
    });

    return {
        ...data,
        challenges: normalizedChallenges,
    };
});


export const getLessonPercentage = cache(async () => {
    const courseProgress = await getCourseProgress();
    if (!courseProgress?.activeLessonId) {
        return 0;
    }
    const lesson = await getLesson(courseProgress.activeLessonId);

    if (!lesson) {
        return 0;
    }

    const completedChallenges = lesson.challenges.filter((challenge) => challenge.completed);

    const percentage = Math.round((completedChallenges.length / lesson.challenges.length) * 100);

    return percentage;
});

// Fetch user subscription for authenticated user
export const getUserSubscription = cache(async () => {
    const { userId } = await auth();

    if (!userId) {
        return null;
    }

    const subscription = await db.query.userSubscription.findFirst({
        where: eq(userSubscription.userId, userId),
    });

    return subscription;
});

// Fetch top 10 users by points with user info from userProgress table
export const getTopTenUsers = cache(async () => {
    const topUsers = await db.query.userProgress.findMany({
        orderBy: (userProgress, { desc }) => [desc(userProgress.points)],
        limit: 10,
    });

    return topUsers.map((up) => ({
        userId: up.userId,
        userName: up.userName || "Unknown",
        userImageSrc: up.userImageSrc || "/default-avatar.png",
        points: up.points,
    }));
});
