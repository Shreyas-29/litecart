import { z } from 'zod'

// id: string;
// name: string | null;
// email: string;
// image: string | null;
// hashedPassword: string | null;
// username: string | null;
// emailVerified: Date | null;
// createdAt: Date;
// updatedAt: Date;

export const UserValidator = z.object({
    username: z.string().min(2).max(20),
    image: z.string().min(1),
});

export type UpdateUserPayload = z.infer<typeof UserValidator>
