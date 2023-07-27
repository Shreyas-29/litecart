import { getCurrentUser, getStoreName } from "@/actions";
import { Navbar, Sidebar, StoreSwitcher, UserNav } from "@/components";
import { db } from "@/lib/db";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import React from "react";

// export const metadatas: Metadata = {
//     title: 'LiteCart - Dashboard',
//     description: 'An e-commerce website built with Next.js, Tailwind CSS, Server Components, and Server Actions.',
//     keywords: [
//         "Next.js",
//         "React",
//         "Tailwind CSS",
//         "Mongo DB",
//         "Stripe",
//         "LiteCart",
//         "E-commerce",
//         "Shadcn UI",
//     ],
//     icons: {
//         icon: '../../favicon.ico',
//     },
//     authors: [
//         {
//             name: "Shreyas",
//             url: "https://github.com/Shreyas-29",
//         },
//     ],
//     creator: "Shreyas"
// };

// export async function metadata({ params }: { params: { id: string } }) {
//     const name = getStoreName(params.id);

//     return {
//         title: `${name} - Dashboard`,
//         description: `Dashboard for ${name} store`,
//         keywords: [
//             "Next.js",
//             "React",
//             "Tailwind CSS",
//             "Mongo DB",
//             "Stripe",
//             "LiteCart",
//             "E-commerce",
//             "Shadcn UI",
//         ],
//         icons: {
//             icon: '../../favicon.ico',
//         },
//         authors: [
//             {
//                 name: "Shreyas",
//                 url: "https://github.com/Shreyas-29",
//             },
//         ],
//         creator: "Shreyas"
//     }
// }

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