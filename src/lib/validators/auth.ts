import { z } from 'zod'

export const RegisterValidator = z.object({
    name: z
        .string()
        .min(3, { message: "The name must be at least 3 characters long" })
        .max(15, { message: "The name must be at most 15 characters long" }),
    email: z.string().email({ message: "The email is not valid" }),
    password: z
        .string()
        .min(8, { message: "The password must be at least 8 characters long" })
        .max(20, { message: "The password must be at most 20 characters long" }),
});

export const LoginValidator = z.object({
    email: z.string().email({ message: "The email is not valid" }),
    password: z
        .string()
        .min(8, { message: "The password must be at least 8 characters long" })
        .max(20, { message: "The password must be at most 20 characters long" }),
})

export type RegisterCreationRequest = z.infer<typeof RegisterValidator>

export type LoginCreationRequest = z.infer<typeof LoginValidator>