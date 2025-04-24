import React, { useCallback } from "react";
import Image from "next/image";
import { useKey } from "react-use";
import { Check } from "lucide-react";
import { cn } from "lib/utils";
import { challenges } from "@/db/schema";
import { useAudio } from "react-use";

type Props = {
    title: string;
    id: number;
    text: string;
    imageSrc: string | null;
    onClick: () => void;
    disabled?: boolean;
    active?: boolean;
    status?: "correct" | "wrong" | "none";
    selected?: boolean;
    shortcut?: string;
    type: typeof challenges.$inferSelect["type"];
    audioSrc?: string | null;
};

export const Card = ({
    id,
    title,
    text,
    imageSrc,
    onClick,
    disabled,
    active,
    status,
    selected,
    shortcut,
    type,
    audioSrc = null,
}: Props) => {
    const [audio, _, controls] = useAudio({ src: audioSrc || "" });

    const handleClick = useCallback(() => {
        if (disabled) return;
        controls.play();
        onClick();
    }, [disabled, onClick, controls]);

    useKey(shortcut, handleClick, {}, [handleClick]);

    return (
        <div
            onClick={handleClick}
            className={cn(
                "h-full border-2 rounded-xl border-b-4 p-4 lg:p-6 cursor-pointer active:border-b-2 transition-colors",
                "hover:bg-black/5",
                selected && "border-sky-300 bg-sky-100 hover:bg-sky-100",
                selected && status === "correct" && "border-pink-300 bg-pink-100 hover:bg-pink-100",
                selected && status === "wrong" && "border-rose-300 bg-rose-100 hover:bg-rose-100",
                disabled && "pointer-events-none hover:bg-white",
                type === "ASSIST" && "lg:p-3 w-full"
            )}
        >
            {audio}
            {imageSrc ? (
                <div className="relative aspect-square mb-4 max-h-[150px] w-full">
                    <Image src={imageSrc} alt={text} fill style={{ objectFit: "cover" }} />
                </div>
            ) : (
                <div className="mb-4 h-36 w-full rounded-md bg-gray-200 flex items-center justify-center text-gray-400">
                    No Image
                </div>
            )}

            <div className={cn("flex items-center justify-between", type === "ASSIST" && "flex-row-reverse")}>
                <p
                    className={cn(
                        "text-neutral-600 text-sm lg:text-base",
                        selected && status === "correct" && "text-pink-500",
                        selected && status === "wrong" && "text-rose-500"
                    )}
                >
                    {text}
                </p>
                {shortcut && (
                    <div
                        className={cn(
                            "lg:w-[30px] lg:h-[30px] w-[20px] border-2 flex items-center justify-center rounded-lg text-neutral-400 lg:text-[15px] text-xs font-semibold",
                            selected && "border-sky-300 text-sky-500",
                            selected && status === "correct" && "border-pink-500 text-pink-500",
                            selected && status === "wrong" && "border-rose-500 text-rose-500"
                        )}
                    >
                        {shortcut}
                    </div>
                )}
            </div>

            <p className="text-neutral-700 text-center font-bold mt-3">
                {title}
            </p>
        </div>
    );
};
