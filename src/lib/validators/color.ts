import { z } from 'zod'

export const ColorValidator = z.object({
    name: z.string().min(2).max(20),
    value: z.string().min(4).max(9).regex(/^#/, {
        message: 'String must be a valid hex code'
    }),
});


export type CreateColorPayload = z.infer<typeof ColorValidator>
