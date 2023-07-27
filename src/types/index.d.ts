import { User } from "@prisma/client"

export type SubscriptionPlan = {
    name: string
    description: string
    username: string | null;
}

export type UserSubscriptionPlan = SubscriptionPlan &
    Pick<User, "username"> & {
        isPro: boolean;
    };
