import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
    const token = await getToken({ req })

    if (!token) {
        return NextResponse.redirect(new URL('/signin', req.nextUrl))
    }
}

// export async function middleware(req: NextRequest) {

//     const path = req.nextUrl.pathname;

//     const token = await getToken({ req });

//     const publicPath = path === '/signin';

//     if (token && publicPath) {
//         return NextResponse.redirect(new URL('/', req.nextUrl))
//     }

//     if (!token && !publicPath) {
//         return NextResponse.redirect(new URL('/signin', req.nextUrl))
//     }
// }

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        '/',
    ]
}