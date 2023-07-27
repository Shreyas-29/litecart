import { getCurrentUser } from "@/actions";
import { UserValidator } from "@/lib";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";


export async function PATCH(
    request: Request,
) {

    try {

        const currentUser = await getCurrentUser();

        const body = await request.json();

        const { username, image } = UserValidator.parse(body);

        if (!currentUser) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        if (!username) {
            return new NextResponse('Invalid username', { status: 422 });
        }

        if (!image) {
            return new NextResponse('Invalid username', { status: 422 });
        }

        const user = await db.user.findUnique({
            where: {
                id: currentUser.id,
            },
        });

        if (!user) {
            return new NextResponse('User not found', { status: 404 });
        }

        const updatedUser = await db.user.update({
            where: {
                id: currentUser.id,
            },
            data: {
                username,
                image,
            },
        });

        return NextResponse.json(updatedUser, { status: 200 });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse('Invalid request data passed', { status: 422 })
        }

        return new NextResponse('Could not create store', { status: 500, })
    }

};