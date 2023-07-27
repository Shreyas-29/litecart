import { z } from 'zod'

export const SizeValidator = z.object({
    name: z.string().min(2).max(20),
    value: z.string().min(1).max(2)
});


export type CreateSizePayload = z.infer<typeof SizeValidator>
