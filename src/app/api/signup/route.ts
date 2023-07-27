import bcrypt from 'bcrypt';

import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from 'zod';

export async function POST(request: Request) {

    const body = await request.json();

    const { name, email, password } = body;

    // console.log(body);

    const hashedPassword = await bcrypt.hash(password, 12);

    if (!name || !email || !password) {
        return new NextResponse('Invalid request data passed', { status: 422 })
    }

    try {

        await db.user.create({
            data: {
                name,
                email,
                hashedPassword
            }
        });

        return new NextResponse('OK', { status: 200 });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse('Invalid request data passed', { status: 422 })
        }

        return new Response('Could not create user', { status: 500, })
    }
}