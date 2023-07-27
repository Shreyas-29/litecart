import { z } from 'zod'

export const ProductValidator = z.object({
    name: z.string().min(2).max(20),
    images: z.object({ url: z.string() }).array().min(1),
    price: z.coerce.number().min(1),
    categoryId: z.string().min(1),
    colorId: z.string().min(1),
    sizeId: z.string().min(1),
    stock: z.coerce.number().min(1),
    brand: z.string().min(1),
    description: z.string().min(10).max(300),
});


export type CreateProductPayload = z.infer<typeof ProductValidator>
