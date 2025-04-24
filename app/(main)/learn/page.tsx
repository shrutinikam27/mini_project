import { redirect } from "next/navigation";
import { FeedWrapper } from "components/feed-wrapper";
import { StickyWrapper } from "components/sticky-wrapper";
import { UserProgress } from "components/user-progress";
import { Header } from "./header";

import { getUserProgress, getUnits, getLessonPercentage, getUserProgressWithActiveLesson, getCourseProgress } from "db/queries";

import { Unit } from "./unit";


const LearnPage = async () => {
    const userProgressData = getUserProgress();
    const courseProgressData = getCourseProgress();
    const lessonPercentageData = getLessonPercentage();
    const unitsData = getUnits();

    const [userProgress, units, courseProgress, lessonPercentage] = await Promise.all([
        userProgressData,
        unitsData,
        courseProgressData,
        lessonPercentageData,
    ]);

    if (!userProgress || !userProgress?.activeCourse) {
        await redirect("/courses");
        return;
    }

    if (!courseProgress) {
        await redirect("/courses");
        return;
    }

    return (
        <div className="flex flex-row-reverse gap-[48px] px-6">
            <StickyWrapper>
                <UserProgress
                    activeCourse={userProgress.activeCourse}
                    hearts={userProgress.hearts}
                    points={userProgress.points}
                    hasActiveSubscription={false}
                />
            </StickyWrapper>
            <FeedWrapper>
                <Header title={userProgress.activeCourse.title} />
                {units.map((unit: any) => (
                    <div key={unit.id} className="mb-10">
                        <Unit
                            id={unit.id}
                            order={unit.order}
                            title={unit.title}
                            description={unit.description}
                            lessons={unit.lessons}
                            activeLesson={courseProgress.activeLesson}
                            activeLessonPercentage={lessonPercentage}
                        />

                    </div>
                ))}
            </FeedWrapper>
        </div>
    );
};
export default LearnPage;

