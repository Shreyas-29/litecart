"use client";

import React, { FC } from 'react'
import { SizeColumn, columns } from './SizeColumn';
import { useParams, useRouter } from 'next/navigation';
import { Button, Header } from '@/components';
import { Separator } from '@/components/ui/Separator';
import { DataTable } from '@/components/ui/DataTable';
import { Plus } from 'lucide-react';


interface SizesProps {
    sizes: SizeColumn[];
}


const Sizes: FC<SizesProps> = ({
    sizes
}) => {

    const params = useParams();

    const router = useRouter();

    return (
        <div className='flex flex-col w-full space-y-4'>
            <div className='w-full  flex items-center justify-between'>
                <Header
                    title={`Sizes (${sizes.length})`}
                    subtitle='Manage your sizes'
                />
                <Button
                    onClick={() => router.push(`/${params.storeId}/sizes/new`)}
                >
                    <Plus className='w-4 h-4 text-current mr-2' />
                    Add New
                </Button>
            </div>
            <Separator />
            <DataTable
                searchKey='name'
                data={sizes}
                columns={columns}
            />
        </div>
    )
}

export default Sizes
