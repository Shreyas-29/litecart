import React from 'react'
import { z } from 'zod';
import CategoryForm from './components/CategoryForm';
import { db } from '@/lib/db';
import { getCategoryById } from '@/actions';


const categoryIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/).length(12);

type CategoryId = z.infer<typeof categoryIdSchema>;


const CreateCategoryPage = async ({
    params
}: {
    params: { categoryId: string, storeId: string }
}) => {

    const { categoryId, storeId } = params;

    const isValidCategoryId = categoryIdSchema.safeParse(categoryId).success;

    const category = await getCategoryById(categoryId);

    if (!isValidCategoryId) {
        return (
            <div className='flex-col'>
                <div className='flex-1 p-8 pt-6'>
                    <CategoryForm initialData={category} />
                </div>
            </div>
        );
    }

    if (!category) {
        <div className='flex-col'>
            <div className='flex-1 p-8 pt-6'>
                <CategoryForm initialData={category} />
            </div>
        </div>
    }

    return (
        <div className='flex-col'>
            <div className='flex-1 space-y-4 p-8 pt-6'>
                <CategoryForm initialData={category} />
            </div>
        </div>
    )
}

export default CreateCategoryPage
