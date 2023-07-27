import { redirect } from "next/navigation";
import React from "react";
import { db } from "@/lib/db";
import getCurrentUser from "@/actions/getCurrentUser";
import { Metadata } from "next";


export const metadata: Metadata = {
    title: 'Litecart | Create Store',
    description: 'Create your store to manage your products and orders',
    icons: {
        icon: [
            '/box.png'
        ]
    }
};


export default async function MainLayout({
    children,
    params
}: {
    children: React.ReactNode,
    params: { id: string }
}) {

    const user = await getCurrentUser();

    if (!user) {
        redirect('/signin');
    }

    const userId = user.id;

    const storeId = params?.id;

    const store = await db.store.findFirst({
        where: {
            id: storeId,
            userId
        }
    });

    if (store) {
        redirect(`/${store.id}`);
    }

    return (
        <>
            {children}
        </>
    )
}