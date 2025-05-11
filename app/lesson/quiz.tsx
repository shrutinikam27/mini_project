"use client";
import React from "react";
import { Header } from "./header";
import { challengeOptions, challenges } from "db/schema";
import { toast } from "sonner";
import { Challenge } from "./challenge";
import { useAudio, useWindowSize, useMount } from "react-use";
import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { QuestionBubble } from "./question-bubble";
import { Footer } from "./footer";
import Confetti from "react-confetti";
import { upsertChallengeProgress } from "actions/challenge-progress";
import { reduceHearts } from "actions/user-progress";
import Image from "next/image";
import { ResultCard } from "./result-card";
import { useHeartsModal } from "store/use-hearts-modal";
import { usePracticeModal } from "store/use-practice-modal";

type Props = {
    initialPercentage: number;
    initialHearts: number;
    initialLessonId: number;
    initialLessonChallenges: (typeof challenges.$inferSelect & {
        completed: boolean;
        challengeOptions: typeof challengeOptions.$inferSelect[];
    })[];
    userSubscription: any;
    nextLessonId?: number | null;
};

export const Quiz = ({
    initialPercentage,
    initialHearts,
    initialLessonId,
    initialLessonChallenges,
    userSubscription,
}: Props) => {
    const { width, height } = useWindowSize();
    const { open: openHeartsModal } = useHeartsModal();
    const { open: openPracticeModal } = usePracticeModal();
    useMount(() => {
        if (initialPercentage === 100) {
            openPracticeModal();
        }
    })
    const router = useRouter();
    const [finishAudio, , finishControls] = useAudio({ src: "/finish.mp3", autoPlay: false });
    const [
        correctAudio,
        _c,
        correctControls,
    ] = useAudio({ src: "/correct.wav" })

    const [
        incorrectAudio,
        _i,
        incorrectControls,
    ] = useAudio({ src: "/incorrect.wav" })
    const [pending, startTransition] = useTransition();

    const [lessonId] = useState(initialLessonId);
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
    const [isCompleted, setIsCompleted] = useState(false);

    // Add isMounted state to control client-only rendering
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);

    const challenge = challenges[activeIndex];

    // Always render audio elements to ensure refs are attached
    const audioElements = (
        <>
            {React.cloneElement(finishAudio, { muted: false, controls: false })}
            {React.cloneElement(correctAudio, { muted: false, controls: false })}
            {React.cloneElement(incorrectAudio, { muted: false, controls: false })}
        </>
    );

    // Play finish audio when completion UI is rendered (no active challenge)
    useEffect(() => {
        if (!challenge) {
            if (typeof window !== "undefined" && window.AudioContext) {
                const audioCtx = new window.AudioContext();
                if (audioCtx.state === "suspended") {
                    audioCtx.resume().then(() => {
                        finishControls.play();
                    });
                } else {
                    finishControls.play();
                }
            } else {
                finishControls.play();
            }
        }
    }, [challenge, finishControls]);

    // Play finish audio explicitly when lesson is completed
    useEffect(() => {
        if (isCompleted) {
            finishControls.play();
        }
    }, [isCompleted, finishControls]);

    const options = challenge?.challengeOptions ?? [];
    const onNext = () => {
        setActiveIndex((current) => {
            const nextIndex = current + 1;
            if (nextIndex >= challenges.length) {
                setIsCompleted(true);
            }
            return nextIndex;
        });
        setStatus("none");
        setSelectedOption(undefined);
    };

    // Remove immediate redirect to courses page when quiz is completed
    // Instead, allow completion page to show and add a button for navigation

    // Commented out redirect effect
    /*
    useEffect(() => {
        console.log("ActiveIndex:", activeIndex, "Challenges length:", challenges.length);
        if (activeIndex >= challenges.length) {
            console.log("Redirecting to /courses");
            router.push("/courses");
        }
    }, [activeIndex, challenges.length, router]);
    */

    const onSelect = (id: number) => {
        if (status !== "none")
            return;
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
                            toast.error("You do not have enough hearts to continue. Please replenish your hearts.");
                            return;
                        }

                        correctControls.play();

                        setStatus("correct");
                        setPercentage((prev) => prev + 100 / challenges.length);

                        //this is a practice
                        if (initialPercentage === 100) {
                            setHearts((prev) => Math.min(prev + 1, 5));
                        }
                    })
                    .catch(() => toast.error("something went wrong, please try again."))
            });
        } else {
            startTransition(() => {
                reduceHearts(challenge.id)
                    .then((response) => {
                        if (response?.error === "hearts") {
                            toast.error("You do not have enough hearts to continue. Please replenish your hearts.");
                            return;
                        }
                        incorrectControls.play();
                        setStatus("wrong");

                        if (!response?.error) {
                            setHearts((prev) => Math.max(prev - 1, 0));
                        }
                    })
                    .catch(() => toast.error("Something went wrong.please try again."))
            })
        }
    };

    // Show completion page if lesson is completed
    if (isCompleted) {
        return (
            <>
                {audioElements}
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
                    <Image src="/finish.svg"
                        alt="FINISH"
                        className="block"
                        height={50}
                        width={50}
                    />
                    <h1 className="text-xl lg:text-3xl font-bold text-neutral-700">
                        Great job! <br />You've completed the lesson.
                    </h1>
                    <div className="flex items-center gap-x-4 w-full">
                        <ResultCard
                            variant="points"
                            value={challenges.length * 10} />

                        <ResultCard
                            variant="hearts"
                            value={hearts} />
                    </div>
                </div>
                <Footer
                    lessonId={lessonId}
                    status="completed"
                    onCheck={() => { }}
                />
                <button
                    className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                    onClick={() => router.push("/courses")}
                >
                    Go to Courses
                </button>
            </>
        );
    }

    const title =
        challenge.type === "ASSIST"
            ? "Select the correct meaning"
            : challenge.question;

    return (
        <>
            {audioElements}
            <Header
                hearts={hearts}
                percentage={percentage}
                hasActiveSubscription={!!userSubscription?.active}
            />

            {/* ⬇️ Add spacing between Header and content */}
            <div className="flex-1 mt-10 px-4 sm:px-6 lg:px-0">
                <div className="h-full flex items-center justify-center">
                    <div className="lg:min-h-[350px] lg:w-[600px] w-full flex flex-col gap-y-3" style={{ marginBottom: "7rem" }}>
                        <h1 className="text-xl lg:text-4xl text-center lg:text-start font-extrabold text-neutral-800">
                            {title}
                        </h1>
                        <div>
                            {challenge.type === "ASSIST" && (
                                <>
                                    <QuestionBubble question={challenge.question} />
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
            </div>

            <Footer
                disabled={pending || !selectedOption}
                status={status}
                onCheck={onContinue}
            />
        </>
    );
};
