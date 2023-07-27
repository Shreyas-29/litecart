import { getCurrentUser } from "@/actions";
import { ColorValidator, ProductValidator } from "@/lib";
import { db } from "@/lib/db"
import { NextResponse } from "next/server";
import { z } from "zod";


export async function GET(
    request: Request,
    { params }: { params: { productId: string } }
) {
    try {

        const { productId } = params;

        if (!productId) {
            return new Response('Invalid productId', { status: 422 })
        }

        const product = await db.product.findUnique({
            where: {
                id: productId
            },
            include: {
                size: true,
                color: true,
                images: true,
                category: true,
            }
        });

        return NextResponse.json(product, { status: 200 });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse('Cloud not get productId', { status: 422 })
        }

        return new NextResponse('Could not get color', { status: 500, })
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: { storeId: string, productId: string } }
) {
    try {

        const user = await getCurrentUser();

        const body = await request.json();

        const { name, images, categoryId, colorId, sizeId, price, stock, brand, description } = ProductValidator.parse(body);

        const { productId, storeId } = params;

        if (!user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        if (!storeId) {
            return new NextResponse('Invalid storeId', { status: 405 });
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

        if (!stock) {
            return new NextResponse('Invalid stock', { status: 422 });
        }

        if (!brand) {
            return new NextResponse('Invalid brand name', { status: 422 });
        }

        if (!description) {
            return new NextResponse('Invalid description', { status: 422 });
        }

        const store = await db.store.findFirst({
            where: {
                id: storeId,
                userId: user.id!
            }
        });

        if (!store) {
            return new NextResponse('You cannot access this store', { status: 405 });
        }

        await db.product.update({
            where: {
                id: productId,
            },
            data: {
                name,
                categoryId,
                colorId,
                sizeId,
                price,
                storeId: storeId,
                images: {
                    deleteMany: {}
                },
                stock,
                brand,
                description
            }
        });

        const product = await db.product.update({
            where: {
                id: productId,
            },
            data: {
                images: {
                    createMany: {
                        data: [
                            ...images.map((image: { url: string }) => image),
                        ],
                    },
                },
            }
        });

        return NextResponse.json(product, { status: 200 });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse('Invalid request data passed', { status: 422 })
        }

        return new NextResponse('Unable to update the color', { status: 500, })
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { storeId: string, productId: string } }
) {
    try {

        const user = await getCurrentUser();

        const { productId, storeId } = params;

        if (!user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        if (!productId) {
            return new NextResponse('Product Id is required', { status: 422 });
        }

        const store = await db.store.findFirst({
            where: {
                id: storeId,
                userId: user.id!
            }
        });

        if (!store) {
            return new NextResponse('You cannot access this store', { status: 405 });
        }

        const product = await db.product.delete({
            where: {
                id: productId
            }
        });

        return NextResponse.json(product, { status: 200 });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse('Product Id not found', { status: 422 })
        }

        return new NextResponse('Unable to delete the product', { status: 500, })
    }
}