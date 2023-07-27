import { z } from 'zod'

export const StoreValidator = z.object({
    name: z.string().min(2).max(20),
});


export type CreateStorePayload = z.infer<typeof StoreValidator>
