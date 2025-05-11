import { getLesson, getUserProgress, getUserSubscription, getCourseProgress } from "db/queries";
import { redirect } from "next/navigation";
import { Quiz } from "../quiz";
import { use } from "react";

type Props = {
    params: Promise<{ lessonId: number }>;
};

const LessonIdPage = async ({
    params,
}: Props) => {
    const { lessonId } = await params;

    const lessonData = getLesson(lessonId);
    const userProgressdata = getUserProgress();
    const userSubscriptionData = getUserSubscription();
    const courseProgressData = getCourseProgress();

    const [lesson, userProgress, userSubscription, courseProgress] = await Promise.all([lessonData, userProgressdata, userSubscriptionData, courseProgressData]);
    console.log("Lesson data:", lesson);
    console.log("User progress data:", userProgress);
    console.log("User subscription data:", userSubscription);
    console.log("Course progress data:", courseProgress);

    if (!lesson || !userProgress) {
        redirect("/learn");
    }

    const initialPercentage = lesson.challenges
        .filter((challenge) => challenge.completed)
        .length / lesson.challenges.length * 100;

    const nextLessonId = courseProgress?.activeLessonId && courseProgress.activeLessonId !== lesson.id ? courseProgress.activeLessonId : null;

    if (nextLessonId) {
        redirect(`/lesson/${nextLessonId}`);
    }

    return (
        <Quiz
            initialPercentage={initialPercentage}
            initialHearts={userProgress.hearts}
            initialLessonId={lesson.id}
            initialLessonChallenges={lesson.challenges}
            userSubscription={userSubscription}
            nextLessonId={nextLessonId}
        />
    );
};

export default LessonIdPage;
