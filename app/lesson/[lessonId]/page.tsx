import { getLesson, getUserProgress, getUserSubscription, getCourseProgress } from "db/queries";
import { redirect } from "next/navigation";
import { Quiz } from "../quiz";


type Props = {
    params: {
        lessonId: number;
    };
};


const LessonIdPage = async ({
    params,
}: Props) => {
    const lessonData = getLesson(params.lessonId);
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

};

export default LessonIdPage;
