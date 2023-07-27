"use client";

import React, { FC } from 'react'
import { CategoryColumn, columns } from './CategoryColumn';
import { useParams, useRouter } from 'next/navigation';
import { Button, Header } from '@/components';
import { Separator } from '@/components/ui/Separator';
import { DataTable } from '@/components/ui/DataTable';
import { Plus } from 'lucide-react';


interface CategoriesProps {
    categories: CategoryColumn[];
}


const Categories: FC<CategoriesProps> = ({
    categories
}) => {

    const params = useParams();

    const router = useRouter();

    return (
        <div className='flex flex-col w-full space-y-4'>
            <div className='w-full  flex items-center justify-between'>
                <Header
                    title={`Categories (${categories.length})`}
                    subtitle='Manage your categories'
                />
                <Button
                    onClick={() => router.push(`/${params.storeId}/categories/new`)}
                >
                    <Plus className='w-4 h-4 text-current mr-2' />
                    Add New
                </Button>
            </div>
            <Separator />
            <DataTable
                searchKey='name'
                data={categories}
                columns={columns}
            />
        </div>
    )
}

export default Categories
