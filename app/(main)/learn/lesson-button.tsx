"use client";
import Link from "next/link";
import { Check, Crown, Star } from "lucide-react";

import { CircularProgressbarWithChildren } from "react-circular-progressbar";
import { cn } from "lib/utils";
import "react-circular-progressbar/dist/styles.css";

type Props = {
    id: number;
    index: number;
    totalCount: number;
    current?: boolean;
    locked?: boolean;
    percentage: number;
    completed?: boolean;
};


export const LessonButton = ({
    id,
    index,
    totalCount,
    locked,
    current,
    percentage,
    completed,
}: Props) => {

    const cycleLength = 8;
    const cycleIndex = index % cycleLength;

    let indentationLevel;

    if (cycleIndex <= 2) { indentationLevel = cycleIndex; }
    else if (cycleIndex <= 4) { indentationLevel = 4 - cycleIndex; }
    else if (cycleIndex <= 6) { indentationLevel = 4 - cycleIndex; }
    else { indentationLevel = cycleIndex - 8; }

    const rightPosition = indentationLevel * 40;

    const isFirst = index === 0;
    const isLast = index === totalCount;
    const isCompleted = completed;


    const Icon = isCompleted ? Check : isLast ? Crown : Star;

    const href = isCompleted ? `/lesson/${id}` : "/lesson";

    return (
        <Link
            href={href}
            aria-disabled={locked}
            style={{ pointerEvents: locked ? "none" : "auto" }}
        >
            <div
                className="relative"
                style={{
                    right: `${rightPosition}px`,
                    marginTop: isFirst && !isCompleted ? 60 : 24,
                }}
            >
                {current ? (
                    <div className="relative h-[102px] w-[102px]">
                        {isFirst && !isCompleted ? (
                            <div className="absolute -top-8 left-2.5 z-10 animate-bounce rounded-4xl border-2 bg-white px-3 py-2.5 font-bold uppercase tracking-wide text-pink-600">
                                Start
                                <div
                                    className="absolute -bottom-2 left-1/2 h-0 w-0 -translate-x-1/2 transform border-x-8 border-t-8 border-x-transparent"
                                    aria-hidden
                                />
                            </div>
                        ) : null}
                        <CircularProgressbarWithChildren
                            value={Number.isNaN(percentage) ? 0 : percentage}
                            styles={{
                                path: {
                                    stroke: "#db2777",
                                },
                                trail: {
                                    stroke: "#e5e7eb",
                                },
                            }}
                        >
                            <div className={cn(
                                "h-[70px] w-[70px] rounded-full flex items-center justify-center",
                                locked ? "bg-gray-400" : "bg-pink-500"
                            )}>
                                <Icon
                                    className={cn(
                                        "h-10 w-10",
                                        locked
                                            ? "fill-neutral-200 stroke-neutral-200 text-neutral-200"
                                            : "fill-white text-white",
                                        isCompleted && "fill-none stroke-[4]"
                                    )}
                                />
                            </div>
                        </CircularProgressbarWithChildren>
                    </div>

                ) : (
                    <div className={cn(
                        "h-[70px] w-[70px] rounded-full flex items-center justify-center",
                        locked ? "bg-gray-400" : "bg-pink-500"
                    )}>
                        <Icon
                            className={cn(
                                "h-10 w-10",
                                locked
                                    ? "fill-neutral-200 stroke-neutral-200 text-neutral-200"
                                    : "fill-white text-white",
                                isCompleted && "fill-none stroke-[4]"
                            )}
                        />
                    </div>
                )}
            </div>

        </Link>
    );
};

export default LessonButton;
