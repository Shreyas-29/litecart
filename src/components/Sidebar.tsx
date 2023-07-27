"use client";


import React from 'react'
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useParams, usePathname, useRouter } from 'next/navigation';
import { Button, buttonVariants } from './ui/Button';
import { Icons } from './Icons';
import Image from 'next/image';
import { Box, Router } from 'lucide-react';
import { User } from '@prisma/client';

const Sidebar = ({ className, user }: React.HTMLAttributes<HTMLElement> & any) => {

    const router = useRouter();

    const params = useParams();

    const pathname = usePathname();

    const storeId = params.storeId;

    const routes = [
        {
            href: `/${storeId}`,
            title: 'General',
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

    const isPro = user?.isPro === true ? true : false;

    return (
        <nav className={cn("flex flex-col items-center justify-betweem text-start max-w-[260px] w-full gap-y-1 fixed left-0 inset-y-0 bg-white border-r border-slate-200 py-4 h-full px-1 z-50", className)}>
            <div className='flex flex-col items-center justify-start w-full gap-y-1'>
                <div className='flex select-none items-center justify-start w-full py-4 px-5 gap-2'>
                    <span className='text-lg font-semibold text-neutral-800'>
                        Dashboard
                    </span>
                </div>
                {routes?.map((route, i) => (
                    <div
                        key={i}
                        onClick={() => router.push(route.href)}
                        className={cn('text-sm select-none font-normal cursor-pointer w-full transition-colors duration-300 ease-out hover:text-slate-900 text-slate-500 px-6 py-2.5 rounded-md bg-white hover:bg-slate-100', route.active && 'text-slate-800 bg-slate-100 font-medium')}
                    >
                        {route.title}
                    </div>
                ))}
            </div>
            <hr className={cn('h-px w-full bg-slate-200', isPro ? 'hidden' : 'block')} />
            {!isPro ? (
                <div className='flex flex-col items-center w-full mt-auto px-1'>
                    <div className='relative mx-auto grid grid-cols-1 gap-4 pb-6 items-center px-5 rounded-xl bg-gradient-to-b from-slate-200/50 to-gray-50 pt-16'>
                        <Image
                            src='/images/subscription.png'
                            alt='Subscription'
                            width={1000}
                            height={1000}
                            draggable={false}
                            className='object-cover absolute inset-x-0 -top-16 z-20 h-auto w-32 mx-auto'
                        />
                        <p className='text-neutral-600 w-full text-center text-sm'>
                            Upgrade to {' '}
                            <span className='font-semibold text-neutral-900'>PRO</span>
                            {' '} for more features.
                        </p>
                        <Button onClick={() => router.push(`/${storeId}/pricing`)}>
                            {isPro ? 'Free plan' : 'Upgrade'}
                        </Button>
                    </div>
                </div>
            ) : null}
        </nav>
    )
}

export default Sidebar
