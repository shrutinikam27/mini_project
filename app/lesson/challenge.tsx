import { challengeOptions, challenges } from "db/schema";

type Props = {
    options: typeof challengeOptions.$inferSelect[];
    onSelect: (id: number) => void;
    status: "correct" | "wrong" | "none";
    selectedOption?: number;
    disabled?: boolean;
    type: typeof challenges.$inferSelect["type"];
};

export const Challenge = ({
    options,
    onSelect,
    status,
    selectedOption,
    disabled,
    type,
}: Props) => {
    return (
        <div>
            Challenge

        </div>
    );
};