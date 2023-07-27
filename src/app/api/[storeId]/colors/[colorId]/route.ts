import { getCurrentUser } from "@/actions";
import { ColorValidator } from "@/lib";
import { db } from "@/lib/db"
import { NextResponse } from "next/server";
import { z } from "zod";


export async function GET(
    request: Request,
    { params }: { params: { colorId: string } }
) {
    try {

        const { colorId } = params;

        if (!colorId) {
            return new Response('Invalid colorId', { status: 422 })
        }

        const category = await db.category.findUnique({
            where: {
                id: colorId
            }
        });

        return NextResponse.json(category, { status: 200 });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse('Invalid request data passed', { status: 422 })
        }

        return new NextResponse('Could not get color', { status: 500, })
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: { storeId: string, colorId: string } }
) {

    try {

        const user = await getCurrentUser();

        const body = await request.json();

        const { name, value } = ColorValidator.parse(body);

        const { colorId, storeId } = params;

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

        const color = await db.color.update({
            where: {
                id: colorId,
            },
            data: {
                name,
                value
            }
        });

        return NextResponse.json(color, { status: 200 });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse('Invalid request data passed', { status: 422 })
        }

        return new NextResponse('Unable to update the color', { status: 500, })
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { storeId: string, colorId: string } }
) {
    try {

        const user = await getCurrentUser();

        const { colorId, storeId } = params;

        if (!user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        if (!colorId) {
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

        const color = await db.color.delete({
            where: {
                id: colorId
            }
        });

        return NextResponse.json(color, { status: 200 });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse('Color Id not found', { status: 422 })
        }

        return new NextResponse('Unable to delete the color', { status: 500, })
    }
}