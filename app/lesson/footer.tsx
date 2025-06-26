"use client";

import { useKey, useMedia } from "react-use";
import { CheckCircle, XCircle } from "lucide-react";
import { cn } from "lib/utils";
import { Button } from "components/ui/button";

type Props = {
    onCheck: () => void;
    status: "correct" | "wrong" | "none" | "completed";
    disabled?: boolean;
    lessonId?: number;
};

import { useState, useEffect } from "react";

export const Footer = ({
    onCheck,
    status,
    disabled,
    lessonId,
}: Props) => {
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);

    useKey("Enter", onCheck, {}, [onCheck]);
    const isMobile = useMedia("(max-width:1024px)");

    return (
        <footer
            className={cn(
                "lg:h-[140px] h-[100px] border-t", // Reduced border thickness from border-t-2 to border-t
                status === "correct" && "border-transparent bg-pink-100",
                status === "wrong" && "border-transparent bg-rose-100"
            )}
        >
            <div className="max-w-[1140px] h-full w-auto flex items-center justify-between px-6 lg:px-10">
                {status === "correct" && (
                    <div className="text-pink-500 font-bold text-base lg:text-2xl flex items-center ">
                        <CheckCircle className="h-6 w-6 lg:h-10 lg:w-10 mr-4" />
                        Nicely Done!
                    </div>
                )}
                {status === "wrong" && (
                    <div className="text-rose-500 font-bold text-base  lg:text-2xl flex items-center ">
                        <XCircle className="h-6 w-6 lg:h-10 lg:w-10 mr-4 " />

                        Try again.
                    </div>
                )}
                {status === "completed" && isMounted && (
                    <Button variant="default" size={isMobile ? "sm" : "lg"}
                        onClick={() => {
                            if (typeof window !== "undefined") {
                                window.location.href = `/lesson/${lessonId}`;
                            }
                        }} >
                        Practice again.
                    </Button>
                )}
                <Button
                    disabled={disabled}
                    className="ml-auto"
                    onClick={onCheck}
                    size={isMobile ? "sm" : "lg"}
                    variant={status === "wrong" ? "danger" : "secondary"}
                >
                    {status === "none" && "Check"}
                    {status === "correct" && "Next"}
                    {status === "wrong" && "Retry"}
                    {status === "completed" && "Continue"}
                </Button>
            </div>
        </footer>

    );
};
