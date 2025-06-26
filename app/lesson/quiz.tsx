"use client";

import { useState, useTransition, useEffect } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";
import Confetti from "react-confetti";
import { useAudio, useWindowSize, useMount } from "react-use";
import { toast } from "sonner";

import { upsertChallengeProgress } from "../../actions/challenge-progress";
import { reduceHearts } from "../../actions/user-progress";
// Temporarily define MAX_HEARTS here to unblock progress
const MAX_HEARTS = 5;
import { challengeOptions, challenges, userSubscription } from "../../db/schema";
import { useHeartsModal } from "../../store/use-hearts-modal";
import { usePracticeModal } from "../../store/use-practice-modal";

import { Challenge } from "./challenge";
import { Footer } from "./footer";
import { Header } from "./header";
import { QuestionBubble } from "./question-bubble";
import { ResultCard } from "./result-card";

type QuizProps = {
    initialPercentage: number;
    initialHearts: number;
    initialLessonId: number;
    initialLessonChallenges: (typeof challenges.$inferSelect & {
        completed: boolean;
        challengeOptions: (typeof challengeOptions.$inferSelect)[];
    })[];
    userSubscription:
    | (typeof userSubscription.$inferSelect & {
        isActive: boolean;
    })
    | null;
};

export const Quiz = ({
    initialPercentage,
    initialHearts,
    initialLessonId,
    initialLessonChallenges,
    userSubscription,
}: QuizProps) => {
    const [correctAudioElem, correctAudioState, correctControls] = useAudio({ src: "/correct.wav" });
    const [incorrectAudioElem, incorrectAudioState, incorrectControls] = useAudio({
        src: "/incorrect.wav",
    });
    const [finishAudioElem, finishAudioState, finishControls] = useAudio({
        src: "/finish.mp3",
        autoPlay: false,
    });
    const { width, height } = useWindowSize();

    const router = useRouter();
    const [pending, startTransition] = useTransition();
    const { open: openHeartsModal } = useHeartsModal();
    const { open: openPracticeModal } = usePracticeModal();

    useMount(() => {
        if (initialPercentage === 100) openPracticeModal();
    });

    const [lessonId] = useState(initialLessonId);
    const [hearts, setHearts] = useState(initialHearts);
    const [percentage, setPercentage] = useState(() => {
        return initialPercentage === 100 ? 0 : initialPercentage;
    });
    const [challenges] = useState(initialLessonChallenges);
    const [activeIndex, setActiveIndex] = useState(() => {
        const uncompletedIndex = challenges.findIndex(
            (challenge) => !challenge.completed
        );

        return uncompletedIndex === -1 ? 0 : uncompletedIndex;
    });

    const [selectedOption, setSelectedOption] = useState<number>();
    const [status, setStatus] = useState<"none" | "wrong" | "correct">("none");

    const challenge = challenges[activeIndex];
    const options = challenge?.challengeOptions ?? [];

    const onNext = () => {
        setActiveIndex((current) => current + 1);
    };

    const onSelect = (id: number) => {
        if (status !== "none") return;

        setSelectedOption(id);
    };

    const onContinue = () => {
        console.log("onContinue called, selectedOption:", selectedOption, "status:", status);
        if (!selectedOption) {
            console.log("No option selected, returning early");
            return;
        }

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

        const correctOption = options.find((option: any) => option.correct);

        if (!correctOption) {
            console.log("No correct option found, returning early");
            return;
        }

        if (correctOption.id === selectedOption) {
            startTransition(() => {
                upsertChallengeProgress(Number(challenge.id))
                    .then((response: any) => {
                        console.log("upsertChallengeProgress response:", response);
                        if (response?.error === "hearts") {
                            openHeartsModal();
                            return;
                        }

                        void correctControls.play();
                        setStatus("correct");
                        setPercentage((prev) => activeIndex * 100 / challenges.length);

                        // This is a practice
                        if (initialPercentage === 100) {
                            setHearts((prev) => Math.min(prev + 1, MAX_HEARTS));
                        }
                    })
                    .catch((err) => {
                        console.error("upsertChallengeProgress error:", err);
                        toast.error("Something went wrong. Please try again.");
                    });
            });
        } else {
            startTransition(() => {
                reduceHearts(Number(challenge.id))
                    .then((response: any) => {
                        console.log("reduceHearts response:", response);
                        if (response?.error === "hearts") {
                            openHeartsModal();
                            return;
                        }

                        void incorrectControls.play();
                        setStatus("wrong");

                        if (!response?.error) setHearts((prev) => Math.max(prev - 1, 0));
                    })
                    .catch((err) => {
                        console.error("reduceHearts error:", err);
                        toast.error("Something went wrong. Please try again.");
                    });
            });
        }
    };

    useEffect(() => {
        if (!challenge) {
            router.push(`/lesson/result-card?points=${challenges.length * 10}&hearts=${userSubscription?.isActive ? Infinity : hearts}`);
        }
    }, [challenge, challenges.length, hearts, router, userSubscription?.isActive]);

    if (!challenge) {
        return (
            <>
                <Confetti width={width} height={height} />
                <div className="flex flex-col gap-4">
                    <ResultCard value={hearts} variant="hearts" />
                    <ResultCard value={Math.floor(percentage)} variant="points" />
                </div>
            </>
        );
    }

    const title =
        challenge.type === "ASSIST"
            ? "Select the correct meaning"
            : typeof challenge.question === "string"
                ? challenge.question
                : JSON.stringify(challenge.question);

    return (
        <>
            {correctAudioElem}
            {incorrectAudioElem}
            {finishAudioElem}
            <Header
                hearts={hearts}
                percentage={percentage}
                hasActiveSubscription={!!userSubscription?.isActive}
            />

            <div className="flex-1">
                <div className="flex h-full items-center justify-center">
                    <div className="flex w-full flex-col gap-y-12 px-6 lg:min-h-[350px] lg:w-[600px] lg:px-0">
                        <h1 className="text-center text-lg font-bold text-neutral-700 lg:text-start lg:text-3xl">
                            {title}
                        </h1>

                        <div>
                            {challenge.type === "ASSIST" && (
                                <QuestionBubble question={typeof challenge.question === "string" ? challenge.question : JSON.stringify(challenge.question)} />
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
            </div>

            <Footer
                disabled={pending || !selectedOption}
                status={status}
                onCheck={onContinue}
            />
        </>
    );
};
