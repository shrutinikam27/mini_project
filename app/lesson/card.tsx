import React, { useCallback } from "react";
import Image from "next/image";
import { useKey } from "react-use";
import { Check } from "lucide-react";
import { cn } from "lib/utils";
import { challenges } from "db/schema";
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

const Card = ({
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
    const hasAudio = audioSrc && audioSrc.trim() !== "";
    const [audio, _, controls] = hasAudio ? useAudio({ src: audioSrc }) : [null, null, { play: () => { } }];

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
                "h-full border-2 rounded-xl border-b-4 p-3 lg:p-4 cursor-pointer active:border-b-2 transition-colors",
                "hover:bg-black/5",
                selected && "border-sky-300 bg-sky-100 hover:bg-sky-100",
                selected && status === "correct" && "border-pink-300 bg-pink-100 hover:bg-pink-100",
                selected && status === "wrong" && "border-rose-300 bg-rose-100 hover:bg-rose-100",
                disabled && "pointer-events-none hover:bg-white",
                type === "ASSIST" && "w-full max-w-[400px]"
            )}
        >
            {audio}
            {type !== "ASSIST" && imageSrc && imageSrc.trim() !== "" ? (
                <div className="relative aspect-square mb-5 max-h-[160px] w-full">
                    <Image src={imageSrc} alt={text} fill sizes="(max-width: 1024px) 100vw, 424px" style={{ objectFit: "cover" }} />
                </div>
            ) : (
                type !== "ASSIST" && (
                    <div className="mb-5 h-40 w-full rounded-md bg-gray-200 flex items-center justify-center text-gray-400">
                        No Image
                    </div>
                )
            )}

            <div className={cn("flex items-center justify-between", type === "ASSIST" && "flex-row-reverse")}>
                <p
                    className={cn(
                        "text-neutral-600 text-base lg:text-lg",
                        selected && status === "correct" && "text-pink-500",
                        selected && status === "wrong" && "text-rose-500"
                    )}
                >
                    {text}
                </p>
                {shortcut && (
                    <div
                        className={cn(
                            "lg:w-[34px] lg:h-[34px] w-[24px] border-2 flex items-center justify-center rounded-lg text-neutral-400 lg:text-[16px] text-sm font-semibold",
                            selected && "border-sky-300 text-sky-500",
                            selected && status === "correct" && "border-pink-500 text-pink-500",
                            selected && status === "wrong" && "border-rose-500 text-rose-500"
                        )}
                    >
                        {shortcut}
                    </div>
                )}
            </div>

            <p className="text-neutral-800 text-center font-extrabold mt-4">
                {title}
            </p>
        </div>
    );
};

export default Card;
