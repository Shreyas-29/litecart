// TODO: Fix this when we turn strict mode on.
import { freePlan, proPlan } from "@/lib";
import { db } from "@/lib/db";

const getUserSubscriptionPlan = async <UserSubscriptionPlan>(userId: string) => {
    const user = await db.user.findFirst({
        where: {
            id: userId,
        },
        select: {
            isPro: true,
        },
    });

    if (!user) {
        throw new Error("User not found")
    }

    // check if the user is on a pro plan
    const isPro = user.isPro;

    const plan = isPro ? proPlan : freePlan;

    return {
        ...plan,
        ...user,
        isPro,
    }
};

export default getUserSubscriptionPlan;