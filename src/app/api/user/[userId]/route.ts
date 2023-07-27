import { getCurrentUser } from "@/actions";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";


const UserValidator = z.object({
    isPro: z.boolean(),
});


export async function PATCH(
    request: Request,
    { params }: { params: { userId: string } }
) {

    try {

        const user = await getCurrentUser();

        const { userId } = params;

        const body = await request.json();

        const { isPro } = body;

        if (!user) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        const checkUser = await db.user.findFirst({
            where: {
                id: userId,
            },
        });

        if (!checkUser) {
            return new NextResponse('User not found', { status: 404 })
        }

        const updatedUser = await db.user.update({
            where: {
                id: userId,
            },
            data: {
                isPro,
            }
        });

        console.log('updatedUser', updatedUser);


        return NextResponse.json(updatedUser, { status: 200 });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse('Invalid request name passed', { status: 404 })
        }

        return new NextResponse('Could not create store', { status: 500, })
    }

};
