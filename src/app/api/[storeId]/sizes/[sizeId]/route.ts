import { getCurrentUser } from "@/actions";
import { SizeValidator } from "@/lib";
import { db } from "@/lib/db"
import { NextResponse } from "next/server";
import { z } from "zod";


export async function GET(
    request: Request,
    { params }: { params: { sizeId: string } }
) {
    try {

        const { sizeId } = params;

        if (!sizeId) {
            return new Response('Invalid sizeId', { status: 422 })
        }

        const size = await db.size.findUnique({
            where: {
                id: sizeId
            }
        });

        return NextResponse.json(size, { status: 200 });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse('Invalid request data passed', { status: 422 })
        }

        return new NextResponse('Could not get size', { status: 500, })
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: { storeId: string, sizeId: string } }
) {

    try {

        const user = await getCurrentUser();

        const body = await request.json();

        const { name, value } = SizeValidator.parse(body);

        const { sizeId, storeId } = params;

        if (!user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        if (!name) {
            return new NextResponse('Invalid name', { status: 422 });
        }

        if (!value) {
            return new NextResponse('Invalid value', { status: 422 });
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
            return new NextResponse('You cannot access this store', { status: 405 });
        }

        const size = await db.size.update({
            where: {
                id: sizeId,
            },
            data: {
                name,
                value
            }
        });

        return NextResponse.json(size, { status: 200 });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse('Invalid request data passed', { status: 422 })
        }

        return new NextResponse('Unable to update the size', { status: 500, })
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { storeId: string, sizeId: string } }
) {
    try {

        const user = await getCurrentUser();

        const { sizeId, storeId } = params;

        if (!user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        if (!sizeId) {
            return new NextResponse('Color Id is required', { status: 422 });
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

        const size = await db.size.delete({
            where: {
                id: sizeId
            }
        });

        return NextResponse.json(size, { status: 200 });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse('Color Id not found', { status: 422 })
        }

        return new NextResponse('Unable to delete the size', { status: 500, })
    }
}