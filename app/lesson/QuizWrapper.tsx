"use client";

import React from "react";
import { Quiz } from "./quiz";

type Props = {
    initialPercentage: number;
    initialHearts: number;
    initialLessonId: number;
    initialLessonChallenges: any[];
    userSubscription: any;
};

const QuizWrapper = ({
    initialPercentage,
    initialHearts,
    initialLessonId,
    initialLessonChallenges,
    userSubscription,
}: Props) => {
    return (
        <Quiz
            initialPercentage={initialPercentage}
            initialHearts={initialHearts}
            initialLessonId={initialLessonId}
            initialLessonChallenges={initialLessonChallenges}
            userSubscription={userSubscription}
        />
    );
};

export default QuizWrapper;
