import { getCurrentUser, getStoreName } from "@/actions";
import { Sidebar, StoreSwitcher, UserNav } from "@/components";
import { db } from "@/lib/db";
import { Metadata } from "next";
import React from "react";

type Props = {
    params: { storeId: string };
};

export const generateMetadata = async (
    props: Props
): Promise<Metadata> => {
    const { params } = props
    const name = await getStoreName(params.storeId)
    return {
        title: `${name} - Dashboard`,
        description: `Dashboard for ${name} store`,
        icons: {
            icon: [
                '/box.png'
            ]
        }
    };
};

export default async function DashboardLayout({
    children
}: {
    children: React.ReactNode
}) {

    const currentUser = await getCurrentUser();

    // if (!currentUser) {
    //     redirect('/signin');
    // }

    const stores = await db.store.findMany({
        where: {
            userId: currentUser?.id
        }
    });

    return (
        <div className='mx-auto ml-[260px] scrollbar-hide'>
            <Sidebar user={currentUser} />
            <div className="pl-4 pr-4">
                <div className="border-b px-4">
                    <div className="flex h-16 items-center px-4">
                        <StoreSwitcher stores={stores} />
                        {/* <Navbar className="mx-6" /> */}
                        <div className="ml-auto flex items-center space-x-4">
                            <UserNav user={currentUser} />
                        </div>
                    </div>
                </div>
                {children}
            </div>
        </div>
    )
}