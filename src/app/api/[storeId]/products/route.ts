import { getCurrentUser } from "@/actions";
import { ColorValidator, ProductValidator } from "@/lib";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from 'zod';

export async function POST(
    request: Request,
    { params }: { params: { storeId: string } }
) {

    const body = await request.json();

    const { name, images, categoryId, colorId, sizeId, price, stock, brand, description } = ProductValidator.parse(body);

    const { storeId } = params;

    const session = await getCurrentUser();

    if (!storeId) {
        return new NextResponse('Invalid storeId', { status: 405 });
    }

    if (!session) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!name) {
        return new NextResponse('Invalid name', { status: 422 });
    }

    if (!images) {
        return new NextResponse('Invalid images', { status: 422 });
    }
    if (!categoryId) {
        return new NextResponse('Invalid categoryId', { status: 422 });
    }

    if (!colorId) {
        return new NextResponse('Invalid colorId', { status: 422 });
    }

    if (!sizeId) {
        return new NextResponse('Invalid sizeId', { status: 422 });
    }

    if (!price) {
        return new NextResponse('Invalid price', { status: 422 });
    }

    try {

        const store = await db.store.findFirst({
            where: {
                id: storeId,
                userId: session.id!
            }
        });

        if (!store) {
            return new NextResponse('Unauthorized', { status: 405 });
        }

        const product = await db.product.create({
            data: {
                name,
                categoryId,
                colorId,
                sizeId,
                price,
                storeId: storeId,
                images: {
                    createMany: {
                        data: [
                            ...images.map((image: { url: string }) => image),
                        ],
                    },
                },
                stock,
                brand,
                description
            }
        });

        return NextResponse.json(product, { status: 200 });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse('Invalid request data passed', { status: 422 })
        }

        return new NextResponse('Could not create store', { status: 500, })
    }
}