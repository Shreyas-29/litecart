import { z } from 'zod'

export const CategoryValidator = z.object({
    name: z.string().min(2).max(20),
});


export type CreateCategoryPayload = z.infer<typeof CategoryValidator>
