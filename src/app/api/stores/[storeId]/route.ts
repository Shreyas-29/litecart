import { getCurrentUser } from "@/actions";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";


export async function PATCH(
    request: Request,
    { params }: { params: { storeId: string } }
) {

    try {

        const user = await getCurrentUser();

        const body = await request.json();

        const { name } = body;

        if (!user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        if (!name) {
            return new NextResponse('Invalid name', { status: 422 });
        }

        if (!params.storeId) {
            return new NextResponse('Invalid store', { status: 422 });
        }

        const store = await db.store.updateMany({
            where: {
                id: params.storeId,
                userId: user.id
            },
            data: {
                name
            }
        });

        return NextResponse.json(store, { status: 200 });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse('Invalid request name passed', { status: 422 })
        }

        return new NextResponse('Could not create store', { status: 500, })
    }

};

export async function DELETE(
    request: Request,
    { params }: { params: { storeId: string } }
) {

    try {

        const user = await getCurrentUser();

        if (!user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        if (!params.storeId) {
            return new NextResponse('Invalid store', { status: 422 });
        }

        const store = await db.store.deleteMany({
            where: {
                id: params.storeId,
                userId: user.id
            }
        });

        return NextResponse.json(store, { status: 200 });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse('Invalid request name passed', { status: 422 })
        }

        return new NextResponse('Could not create store', { status: 500, })
    }
};