import { getCurrentUser } from "@/actions";
import { ColorValidator } from "@/lib";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from 'zod';

export async function POST(
    request: Request,
    { params }: { params: { storeId: string } }
) {

    const body = await request.json();

    const { name, value } = ColorValidator.parse(body);

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

    if (!value) {
        return new NextResponse('Invalid value', { status: 422 });
    }

    try {

        const store = await db.store.findFirst({
            where: {
                id: storeId,
                userId: session.id!
            }
        });

        if (!store) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const colorExists = await db.color.findFirst({
            where: {
                name,
                value,
                storeId
            }
        });

        if (colorExists) {
            return new NextResponse('Color already exists', { status: 409 });
        }

        const color = await db.color.create({
            data: {
                name,
                value,
                storeId: storeId
            }
        });

        return NextResponse.json(color, { status: 200 });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse('Invalid request data passed', { status: 422 })
        }

        return new NextResponse('Could not create store', { status: 500, })
    }
}