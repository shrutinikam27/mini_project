import { getLesson, getUserProgress, getUserSubscription } from "db/queries";
import { redirect } from "next/navigation";
import LessonPageClient from "./LessonPageClient";

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

    return (
        <LessonPageClient
            lesson={lesson}
            userProgress={userProgress}
            userSubscription={userSubscription}
        />
    );
};

export default LessonPage;