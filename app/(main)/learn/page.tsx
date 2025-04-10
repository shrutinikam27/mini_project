import { redirect } from "next/navigation";
import { FeedWrapper } from "components/feed-wrapper";
import { StickyWrapper } from "components/sticky-wrapper";
import { UserProgress } from "components/user-progress";
import { Header } from "./header";

import { getUserProgress } from "@/db/queries";

const LearnPage = async () => {
    const UserProgressData = getUserProgress();
    const [UserProgress] = await Promise.all([
        UserProgressData,
    ]);

    if (!UserProgress || !UserProgress.activeCourse) {
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
                <Header title="Spanish" />
            </FeedWrapper>
        </div>
    );
}

export default LearnPage;
