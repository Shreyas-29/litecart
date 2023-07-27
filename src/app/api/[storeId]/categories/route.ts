import { getCurrentUser } from "@/actions";
import { CategoryValidator } from "@/lib";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from 'zod';

export async function POST(
    request: Request,
    { params }: { params: { storeId: string } }
) {

    const body = await request.json();

    const { name } = CategoryValidator.parse(body);

    const { storeId } = params;

    const session = await getCurrentUser();

    if (!session) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!name) {
        return new NextResponse('Invalid name', { status: 422 });
    }

    if (!storeId) {
        return new NextResponse('Invalid storeId', { status: 422 });
    }

    try {

        const store = await db.store.findFirst({
            where: {
                id: storeId,
                userId: session.id!
            }
        });

        if (!store) {
            return new NextResponse('Unauthorized', { status: 403 });
        }

        const categoryExists = await db.category.findFirst({
            where: {
                name,
                storeId
            }
        });

        if (categoryExists) {
            return new NextResponse('Category already exists', { status: 409 });
        }

        const category = await db.category.create({
            data: {
                name,
                storeId: storeId
            }
        });

        return NextResponse.json(category, { status: 200 });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse('Invalid name', { status: 422 })
        }

        return new NextResponse('Could not create store', { status: 500, })
    }
}