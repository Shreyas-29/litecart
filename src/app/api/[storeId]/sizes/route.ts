import { getCurrentUser } from "@/actions";
import { ColorValidator, SizeValidator } from "@/lib";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from 'zod';

export async function POST(
    request: Request,
    { params }: { params: { storeId: string } }
) {

    const body = await request.json();

    const { name, value } = SizeValidator.parse(body);

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
            return new NextResponse('You cannot access this store', { status: 401 });
        }

        const sizeExists = await db.size.findFirst({
            where: {
                name,
                storeId
            }
        });

        if (sizeExists) {
            return new NextResponse('Size already exists', { status: 409 });
        }

        const size = await db.size.create({
            data: {
                name,
                value,
                storeId: storeId
            }
        });

        return NextResponse.json(size, { status: 200 });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse('Invalid request data passed', { status: 422 })
        }

        return new NextResponse('Could not create store', { status: 500, })
    }
}