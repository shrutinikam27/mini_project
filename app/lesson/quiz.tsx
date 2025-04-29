"use client";
import React from "react";
import { Header } from "./header";
import { challengeOptions, challenges } from "db/schema";
import { toast } from "sonner";
import { Challenge } from "./challenge";
import { useAudio, useWindowSize } from "react-use";
import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { QuestionBubble } from "./question-bubble";
import { Footer } from "./footer";
import Confetti from "react-confetti";
import { upsertChallengeProgress } from "actions/challenge-progress";
import { reduceHearts } from "actions/user-progress";
import Image from "next/image";
import { ResultCard } from "./result-card";

type Props = {
    initialPercentage: number;
    initialHearts: number;
    initialLessonId: number;
    initialLessonChallenges: (typeof challenges.$inferSelect & {
        completed: boolean;
        challengeOptions: typeof challengeOptions.$inferSelect[];
    })[];
    userSubscription: any;
};

export const Quiz = ({
    initialPercentage,
    initialHearts,
    initialLessonId,
    initialLessonChallenges,
    userSubscription,
}: Props) => {
    const { width, height } = useWindowSize();
    const router = useRouter();
    const [finishAudio, , finishControls] = useAudio({ src: "/finish.mp3" });
    const [
        correctAudio,
        _c,
        correctControls,
    ] = useAudio({ src: "/correct.wav" });

    const [
        incorrectAudio,
        _i,
        incorrectControls,
    ] = useAudio({ src: "/incorrect.wav" });

    // Render audio elements to avoid useAudio ref error
    const [pending, startTransition] = useTransition();

    const [lessonId, setLessonId] = useState(initialLessonId);
    const [hearts, setHearts] = useState(initialHearts);
    const [percentage, setPercentage] = useState(initialPercentage);
    const [challenges] = useState(initialLessonChallenges);
    const [activeIndex, setActiveIndex] = useState(() => {
        const uncompletedIndex = challenges.findIndex(
            (challenge) => !challenge.completed
        );
        return uncompletedIndex === -1 ? 0 : uncompletedIndex;
    });

    const [selectedOption, setSelectedOption] = useState<number>();
    const [status, setStatus] = useState<"correct" | "wrong" | "none">("none");

    // Add isMounted state to control client-only rendering
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);

    const challenge = challenges[activeIndex];

    // Play finish audio when completion UI is rendered (no active challenge)
    useEffect(() => {
        if (!challenge) {
            finishControls.play();
        }
    }, [challenge, finishControls]);

    const options = challenge?.challengeOptions ?? [];
    const onNext = () => {
        setActiveIndex((current) => current + 1);

    };

    // Redirect to courses page when quiz is completed
    useEffect(() => {
        if (activeIndex >= challenges.length) {
            router.push("/courses");
        }
    }, [activeIndex, challenges.length, router]);


    const onSelect = (id: number) => {
        if (status !== "none") return;
        setSelectedOption(id);
    };

    const onContinue = () => {
        if (!selectedOption) return;

        if (status === "wrong") {
            setStatus("none");
            setSelectedOption(undefined);
            return;
        }

        if (status === "correct") {
            onNext();
            setStatus("none");
            setSelectedOption(undefined);
            return;
        }
        const correctOption = options.find((option) => option.correct);

        if (!correctOption) {
            return;
        }

        if (correctOption.id === selectedOption) {
            startTransition(() => {
                upsertChallengeProgress(challenge.id)
                    .then((response) => {
                        if (response?.error === "hearts") {
                            console.error("missing hearts");
                            return;
                        }

                        correctControls.play();


                        setStatus("correct");
                        setPercentage((prev) => prev + 100 / challenges.length);

                        // this is a practice
                        if (initialPercentage === 100) {
                            setHearts((prev) => Math.min(prev + 1, 5));

                        }
                    })
                    .catch(() => toast.error("something went wrong, please try again."));
            });
        } else {
            startTransition(() => {
                reduceHearts(challenge.id)
                    .then((response) => {
                        if (response?.error === "hearts") {
                            console.log("Missing Hearts");
                            return;
                        }
                        incorrectControls.play();
                        setStatus("wrong");

                        if (!response?.error) {
                            setHearts((prev) => Math.max(prev - 1, 0));
                        }
                    })
                    .catch(() => toast.error("Something went wrong.please try again."));
            });
        }
    };

    if (!challenge) {
        return (
            <>
                {finishAudio}
                {correctAudio}
                {incorrectAudio}
                {isMounted && (
                    <Confetti
                        width={width}
                        height={height}
                        recycle={false}
                        numberOfPieces={500}
                        tweenDuration={10000}
                    />
                )}
                <div className="flex flex-col gap-y-4 lg:gap-y-8 max-w-lg mx-auto text-center items-center justify-center h-full">
                    <Image
                        src="/finish.svg"
                        alt="FINISH"
                        className="block lg:hidden"
                        height={100}
                        width={100}
                    />

                    <Image
                        src="/finish.svg"
                        alt="FINISH"
                        className="block lg:hidden"
                        height={50}
                        width={50}
                    />
                    <h1 className="text-xl lg:text-3xl font-bold text-neutral-700">
                        Great job! <br />
                        You've completed the lesson.
                    </h1>
                    <div className="flex items-center justify-center gap-x-4 w-full">
                        <ResultCard variant="points" value={challenges.length * 10} />

                        <ResultCard variant="hearts" value={hearts} />
                    </div>
                </div>
                <Footer
                    lessonId={lessonId}
                    status="completed"
                    onCheck={() => router.push("/learn")} />
            </>
        );
    }

    const title = challenge.type === "ASSIST" ? "Select the correct meaning" : challenge.question;

    return (
        <>
            {finishAudio}
            {correctAudio}
            {incorrectAudio}
            <div className="flex flex-col min-h-screen">
                <Header hearts={hearts} percentage={percentage} hasActiveSubscription={!!userSubscription?.active} />
                <main className="flex-grow mt-16 px-4 sm:px-6 lg:px-0">
                    <div className="h-full flex items-center justify-center">
                        <div className="lg:min-h-[350px] lg:w-[600px] w-full flex flex-col gap-y-3" style={{ marginBottom: "7rem" }}>
                            <h1 className="text-xl lg:text-4xl text-center lg:text-start font-extrabold text-neutral-800">{title}</h1>
                            <div>
                                {challenge.type === "ASSIST" && (
                                    <>
                                        <QuestionBubble question={challenge.question} />
                                        <div className="flex justify-center mb-4">
                                            <Image src="/man.svg" alt="man" width={120} height={120} priority />
                                        </div>
                                    </>
                                )}
                                <Challenge
                                    options={options}
                                    onSelect={onSelect}
                                    status={status}
                                    selectedOption={selectedOption}
                                    disabled={pending}
                                    type={challenge.type}
                                />
                            </div>
                        </div>
                    </div>
                </main>

            </div>

            <Footer
                disabled={pending || !selectedOption}
                status={status}
                onCheck={onContinue}
            />
        </>
    );
};
