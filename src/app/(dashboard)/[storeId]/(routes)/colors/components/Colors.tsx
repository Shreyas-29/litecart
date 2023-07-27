"use client";

import { Button, Header } from '@/components';
import { DataTable } from '@/components/ui/DataTable';
import { Separator } from '@/components/ui/Separator';
import { Plus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { FC } from 'react';
import { ColorColumn, columns } from './ColorColumn';

interface ColorsProps {
    colors: ColorColumn[];
}

const Colors: FC<ColorsProps> = ({
    colors
}) => {

    const params = useParams();

    const router = useRouter();

    return (
        <div className='flex flex-col w-full space-y-4'>
            <div className='w-full  flex items-center justify-between'>
                <Header
                    title={`Colors (${colors.length})`}
                    subtitle='Manage your colors'
                />
                <Button
                    onClick={() => router.push(`/${params.storeId}/colors/new`)}
                >
                    <Plus className='w-4 h-4 text-current mr-2' />
                    Add New
                </Button>
            </div>
            <Separator />
            <DataTable
                searchKey='name'
                data={colors}
                columns={columns}
            />
        </div>
    )
}

export default Colors
