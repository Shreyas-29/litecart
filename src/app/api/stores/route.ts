import { getCurrentUser } from "@/actions";
import { StoreValidator } from "@/lib";
import { db } from "@/lib/db";
import { getServerSession } from 'next-auth';
import { NextResponse } from "next/server";
import { z } from 'zod';

export async function POST(request: Request) {

    const body = await request.json();

    const { name } = StoreValidator.parse(body);

    const session = await getCurrentUser();

    // console.log("user", session);

    if (!session) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!name) {
        return new NextResponse('Invalid name', { status: 422 });
    }

    // console.log('name', name);

    try {

        const existingStore = await db.store.findFirst({
            where: {
                name,
                userId: session.id
            }
        });

        if (existingStore) {
            return new NextResponse('Store already exists', { status: 409 })
        }

        const store = await db.store.create({
            data: {
                name,
                userId: session.id
            }
        });

        return NextResponse.json(store, { status: 200 });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse('Invalid name', { status: 422 })
        }

        return new NextResponse('Could not create store', { status: 500, })
    }
}