"use client";
import { Header } from "./header";
import { challengeOptions, challenges } from "db/schema";
import { toast } from "sonner";
import { Challenge } from "./challenge";
import { useState, useTransition } from "react";
import { QuestionBubble } from "./question-bubble";
import { Footer } from "./footer";
import { upsertChallengeProgress } from "actions/challenge-progress";

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
    const [pending, startTransition] = useTransition();


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

    const challenge = challenges[activeIndex];
    const options = challenge?.challengeOptions ?? [];
    const onNext = () => {
        setActiveIndex((current) => current + 1);

    };


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
            setStatus("none");
            setSelectedOption(undefined);
            return;
        }
        const correctOption = options.find((option) => option.correct);

        if (!correctOption) {
            return;
        }

        if (correctOption && correctOption.id === selectedOption) {
            startTransition(() => {
                upsertChallengeProgress(challenge.id)
                    .then((response) => {
                        if (response?.error === "hearts") {
                            console.error("missing hearts");
                            return;
                        }

                        setStatus("correct");
                        setPercentage((prev) => prev + 100 / challenges.length);


                        //this is a practice
                        if (initialPercentage === 100) {
                            setHearts((prev) => Math.min(prev + 1, 5));

                        }
                    })
                    .catch(() => toast.error("something went wrong, please try again."))
            })
        } else {
            console.log("incorrect option!");
        }
    };

    const title =
        challenge.type === "ASSIST"
            ? "Select the correct meaning"
            : challenge.question;

    return (
        <>
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
                                <QuestionBubble question={challenge.question} />
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
                disabled={!selectedOption}
                status={status}
                onCheck={onContinue}
            />
        </>
    );
};
