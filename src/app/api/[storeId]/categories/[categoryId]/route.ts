import { getCurrentUser } from "@/actions";
import { CategoryValidator } from "@/lib";
import { db } from "@/lib/db"
import { NextResponse } from "next/server";
import { z } from "zod";


export async function GET(
    request: Request,
    { params }: { params: { categoryId: string } }
) {
    try {

        const { categoryId } = params;

        if (!categoryId) {
            return new Response('Invalid categoryId', { status: 422 })
        }

        const category = await db.category.findUnique({
            where: {
                id: categoryId
            }
        });

        return NextResponse.json(category, { status: 200 });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse('Invalid categoryId', { status: 422 })
        }

        return new NextResponse('Could not get category', { status: 500, })
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: { storeId: string, categoryId: string } }
) {
    try {

        const user = await getCurrentUser();

        const body = await request.json();

        const { name } = CategoryValidator.parse(body);

        const { categoryId, storeId } = params;

        if (!user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        if (!name) {
            return new NextResponse('Invalid name', { status: 422 });
        }

        if (!storeId) {
            return new NextResponse('Invalid storeId', { status: 422 });
        }

        const store = await db.store.findFirst({
            where: {
                id: storeId,
                userId: user.id!
            }
        });

        if (!store) {
            return new NextResponse('Store not found', { status: 405 });
        }

        const category = await db.category.update({
            where: {
                id: categoryId,
            },
            data: {
                name,
            }
        });

        return NextResponse.json(category, { status: 200 });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse('Invalid name', { status: 422 })
        }

        return new NextResponse('Unable to update the category', { status: 500, })
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { storeId: string, categoryId: string } }
) {
    try {

        const user = await getCurrentUser();

        const { storeId, categoryId } = params;

        if (!user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        if (!categoryId) {
            return new NextResponse('Category Id is required', { status: 422 });
        }

        const store = await db.store.findFirst({
            where: {
                id: storeId,
                userId: user.id!
            }
        });

        if (!store) {
            return new NextResponse('You cannot access this store', { status: 403 });
        }

        const category = await db.category.delete({
            where: {
                id: categoryId
            }
        });

        return NextResponse.json(category, { status: 200 });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse('Category Id not found', { status: 422 })
        }

        return new NextResponse('Unable to delete the category', { status: 500, })
    }
}