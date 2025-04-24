import { getLesson, getUserProgress } from "db/queries";
import { redirect } from "next/navigation";


const LessonPage = async () => {
    const lessonData = getLesson();
    const userProgressdata = getUserProgress();

    const [lesson, userProgress] = await Promise.all([lessonData, userProgressdata]);
    if (!lesson || !userProgress) {
        redirect("/learn");
    }
    return (
        <div>
            Lesson Page
        </div>
    );
};

export default LessonPage;
