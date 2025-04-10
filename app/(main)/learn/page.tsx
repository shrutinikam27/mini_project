import { redirect } from "next/navigation";
import { FeedWrapper } from "components/feed-wrapper";
import { StickyWrapper } from "components/sticky-wrapper";
import { UserProgress } from "components/user-progress";
import { Header } from "./header";
import { getUserProgress, getUnits } from "db/queries";
import { UnitBanner } from "./unit-banner";

const LearnPage = async () => {
    const userProgressData = await getUserProgress();
    const unitsData = getUnits();
    const [userProgress, units] = await Promise.all([
        userProgressData, unitsData,
    ]);



    if (!userProgress || !userProgress.activeCourse) {
        redirect("/courses");

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
                {units.map((unit) => (
                    <div key={unit.id} className="mb-10">

                        <UnitBanner
                            title={unit.title}
                            description={unit.description}
                        />

                    </div>
                ))}
            </FeedWrapper>
        </div>
    );
}

export default LearnPage;
