"use client";

import React from 'react'
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useParams, usePathname } from 'next/navigation';

const Navbar = ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => {

    const pathname = usePathname();
    const params = useParams();

    const storeId = params.storeId;

    const routes = [
        {
            href: `/${storeId}`,
            title: 'Overview',
            active: pathname === `/${storeId}`,
        },
        {
            href: `/${storeId}/categories`,
            title: 'Categories',
            active: pathname === `/${storeId}/categories`,
        },
        {
            href: `/${storeId}/colors`,
            title: 'Colors',
            active: pathname === `/${storeId}/colors`,
        },
        {
            href: `/${storeId}/sizes`,
            title: 'Sizes',
            active: pathname === `/${storeId}/sizes`,
        },
        {
            href: `/${storeId}/products`,
            title: 'Products',
            active: pathname === `/${storeId}/products`,
        },
        {
            href: `/${storeId}/orders`,
            title: 'Orders',
            active: pathname === `/${storeId}/orders`,
        },
        {
            href: `/${storeId}/settings`,
            title: 'Settings',
            active: pathname === `/${storeId}/settings`,
        },
    ];

    return (
        <nav
            {...props}
            className={cn("flex items-center space-x-4 lg:space-x-6", className)}
        >
            {routes?.map((route, i) => (
                <Link
                    href={route.href}
                    key={i}
                    className={cn('text-sm select-none font-medium transition-colors hover:text-neutral-900 text-neutral-500', route.active && 'text-neutral-900')}
                >
                    {route.title}
                </Link>
            ))}
        </nav>
    )
}

export default Navbar
