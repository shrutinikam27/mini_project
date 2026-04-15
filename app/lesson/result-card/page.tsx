"use client";

import React, { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ResultCard } from "../result-card";
import Image from "next/image";

const ResultCardContent = () => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const points = searchParams.get("points");
    const hearts = searchParams.get("hearts");

    const pointsValue = points ? parseInt(points, 10) : 0;
    const heartsValue = hearts ? parseInt(hearts, 10) : 0;

    return (
        <div className="flex flex-col gap-y-4 lg:gap-y-8 max-w-lg mx-auto text-center items-center justify-center h-full p-6">
            <Image
                src="/finish.svg"
                alt="FINISH"
                className="block"
                height={50}
                width={50}
            />
            <h1 className="text-xl lg:text-3xl font-bold text-neutral-700">
                Great job! <br />You've completed the lesson.
            </h1>
            <div className="flex items-center gap-x-4 w-full">
                <ResultCard variant="points" value={pointsValue} />
                <ResultCard variant="hearts" value={heartsValue} />
            </div>
            <button
                className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                onClick={() => router.push("/courses")}
            >
                Go to Courses
            </button>
        </div>
    );
};

const ResultCardPage = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResultCardContent />
        </Suspense>
    );
};

export default ResultCardPage;
