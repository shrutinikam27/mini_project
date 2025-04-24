import { useKey, useMedia } from "react-use";
import { CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type Props = {
    onCheck: () => void;
    status: "correct" | "wrong" | "none";
    disabled?: boolean;
    lessonId?: boolean;
};

export const Footer = ({
}: Props) => {
    return (
        <footer>

        </footer >
    );
};