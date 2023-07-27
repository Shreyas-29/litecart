import { PrismaClient } from '@prisma/client'

declare global {
    // eslint-disable-next-line no-var, no-unused-vars
    var prisma: PrismaClient
}

let prisma;

if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient()
} else {
    if (!global.prisma) {
        global.prisma = new PrismaClient()
    }
    prisma = global.prisma
}

export const db = prisma;