import { SubscriptionPlan } from "@/types"

export const freePlan: SubscriptionPlan = {
    name: "Free",
    description:
        "The free plan is limited to 12 products. Upgrade to the PRO plan for unlimited products.",
    username: "",
}

export const proPlan: SubscriptionPlan = {
    name: "PRO",
    description: "The PRO plan has unlimited features.",
    username: "",
}