import { getLesson, getUserProgress, getUserSubscription } from "db/queries";
import { redirect } from "next/navigation";
import { Quiz } from "./quiz";

const LessonPage = async () => {
    const lessonData = getLesson();
    const userProgressdata = getUserProgress();
    const userSubscriptionData = getUserSubscription();

    const [lesson, userProgress, userSubscription] = await Promise.all([lessonData, userProgressdata, userSubscriptionData]);
    console.log("Lesson data:", lesson);
    console.log("User progress data:", userProgress);
    console.log("User subscription data:", userSubscription);

    if (!lesson || !userProgress) {
        redirect("/learn");
    }

    const initialPercentage = lesson.challenges
        .filter((challenge) => challenge.completed)
        .length / lesson.challenges.length * 100;

    return (
        <div className="flex items-center justify-center min-h-screen">
            <Quiz
                initialLessonId={lesson.id}
                initialLessonChallenges={lesson.challenges}
                initialHearts={userProgress.hearts}
                initialPercentage={initialPercentage}
                userSubscription={userSubscription}
            />
        </div>
    );
};

export default LessonPage;
