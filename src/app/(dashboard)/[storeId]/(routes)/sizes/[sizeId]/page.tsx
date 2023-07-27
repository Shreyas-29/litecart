import { getColorById, getSizeById } from '@/actions';
import React from 'react'
import { z } from 'zod';
import SizeForm from './components/SizeForm';


const sizeIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/).length(12);

const CreateSizes = async ({
    params
}: {
    params: { sizeId: string }
}) => {

    const { sizeId } = params;

    const isValidSizeId = sizeIdSchema.safeParse(sizeId).success;

    const size = await getSizeById(sizeId);

    if (!isValidSizeId) {
        return (
            <div className='flex-col'>
                <div className='flex-1 p-8 pt-6'>
                    <SizeForm initialData={size} />
                </div>
            </div>
        )
    }

    if (!size) {
        <div className='flex-col'>
            <div className='flex-1 p-8 pt-6'>
                having a size
                <SizeForm initialData={size} />
            </div>
        </div>
    }

    return (
        <div className='flex-col'>
            <div className='flex-1 p-8 pt-6'>
                <SizeForm initialData={size} />
            </div>
        </div>
    )
}

export default CreateSizes
