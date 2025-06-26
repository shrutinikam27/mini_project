"use client";

import { useTransition } from "react";

import Image from "next/image";
import { Button } from "components/ui/button";
const POINTS_TO_REFILL = 10;
import { toast } from "sonner";

import { refillHearts } from "actions/user-progress";
/* Removed import of createStripeUrl since it does not exist */
// import { createStripeUrl } from "actions/user-subscription";
//import { Button } from "components/ui/button";

import { HeartsModal } from "components/modals/hearts-modal";

type Props = {
    hearts: number;
    points: number;
    hasActiveSubscription: boolean;
};

export const Items = ({
    hearts,
    points,
    hasActiveSubscription,
}: Props) => {
    const [pending, startTransition] = useTransition();

    const onRefillHearts = () => {
        if (pending || hearts === 5 || points < POINTS_TO_REFILL) {
            return;
        }
        startTransition(() => {
            refillHearts().catch(() => toast.error("Something went wrong."));
        });
    };

    /* Removed onUpgrade function since createStripeUrl does not exist */
    // const onUpgrade = () => {
    //     toast.loading("Redirecting to checkout...");
    //     startTransition(() => {
    //         createStripeUrl()
    //             .then((response: any) => {
    //                 if (response.data) window.location.href = response.data;
    //             })
    //             .catch(() => toast.error("Something went wrong."));
    //     });
    // };


    return (

        <ul className="w-full">
            <div className="flex items-center w-full p-4 gap-x-4 border-t-2" />
            <Image
                src="/heart.svg"
                alt="Heart"
                height={60}
                width={60}
            />

            <div className="flex-1">
                <p className="text-neutral-700 text-base  lg:text-xl font-bold">
                    Refill hearts
                </p>
            </div>

            <Button
                onClick={onRefillHearts}
                disabled={
                    pending
                    || hearts === 5
                    || points < POINTS_TO_REFILL
                }
            >
                {hearts === 5
                    ? "full"
                    : (
                        <div className="flex items-center">
                            <Image
                                src="/points.svg"
                                alt="points"
                                height={20}
                                width={20}
                            />
                            <p>
                                {POINTS_TO_REFILL}
                            </p>
                        </div>
                    )
                }

            </Button>
        </ul>
    );
};








