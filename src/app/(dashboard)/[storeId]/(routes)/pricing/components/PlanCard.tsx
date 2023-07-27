"use client";

import { Button } from "@/components";
import { toast } from "@/components/hooks/use-toast";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/Card";
import { User } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";


interface PlanCardProps {
    user: User | null;
}


const PlanCard: FC<PlanCardProps> = ({
    user
}) => {

    const router = useRouter();

    const [isPro, setIsPro] = useState<boolean>(user?.isPro! || false);

    const userId = user?.id;

    const message = isPro ? 'You are now on the PRO plan.' : 'You are now on the Free plan.';

    const { mutate: upgradetoPro, isLoading } = useMutation({
        mutationFn: async ({ isPro }: any) => {
            const payload = {
                isPro
            }

            const { data } = await axios.patch(`/api/user/${userId}`, payload);
            return data;
        },
        onError: (error) => {
            if (error instanceof AxiosError) {
                if (error.response?.status === 422) {
                    return toast({
                        title: 'You cannot upgrade PRO plan',
                        description: 'There was a problem with your request, please try again.',
                        variant: 'destructive'
                    })
                }
            }

            toast({
                title: 'There was a problem',
                description: 'Unable to upgrade to PRO, please try again.',
                variant: 'destructive'
            })
        },
        onSuccess: (data) => {
            toast({
                description: `${message}`
            });
            router.refresh();
            setIsPro((prev) => !prev);
        }
    });

    const handleChangePlan = () => {
        if (userId) {
            try {
                upgradetoPro({ isPro: !isPro });
                setIsPro((prev) => !prev);
                router.refresh();
            }
            catch (error) {
                console.log('Unable to change plan', error);
            }
        }
    }

    useEffect(() => {
        setIsPro(user?.isPro!);
    }, [user?.isPro]);


    return (
        <div className="flex w-full">
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="text-xl font-semibold">
                        Subscription Plan
                    </CardTitle>
                    <CardDescription>
                        You are currently on the
                        <span className="font-semibold text-slate-700">
                            {isPro ? ' PRO ' : ' Free '}
                        </span>
                        plan.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-start gap-y-6">
                        <p className="text-base text-slate-800">
                            {isPro ?
                                'You have access to all features.' :
                                ' The free plan is limited to 3 store. You can upgrade to the Pro plan at any time.'
                            }
                        </p>
                        <Button
                            isLoading={isLoading}
                            onClick={handleChangePlan}
                        >
                            {isPro ? 'Manage Subscription' : 'Upgrade to Pro'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default PlanCard;