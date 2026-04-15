"use client";

import React from "react";
import QuizWrapper from "./QuizWrapper";

type Props = {
    lesson: any;
    userProgress: any;
    userSubscription: any;
};

const LessonPageClient = ({ lesson, userProgress, userSubscription }: Props) => {
    const initialPercentage = lesson.challenges
        .filter((challenge: any) => challenge.completed)
        .length / lesson.challenges.length * 100;

    return (
        <QuizWrapper
            initialLessonId={lesson.id}
            initialLessonChallenges={lesson.challenges}
            initialHearts={userProgress.hearts}
            initialPercentage={initialPercentage}
            userSubscription={userSubscription}
        />
    );
};

export default LessonPageClient;
