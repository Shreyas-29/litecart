import { db } from '@/lib/db'
import { format } from 'date-fns';
import React from 'react'
import Categories from './components/Categories';


const CategoryPage = async ({
    params
}: {
    params: { storeId: string }
}) => {

    const categories = await db.category.findMany({
        where: {
            storeId: params.storeId
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    const formattedCategories = categories.map((category) => ({
        id: category.id,
        name: category.name,
        createdAt: format(category.createdAt, 'do MMMM, yyyy'),
    }));

    return (
        <div className='flex-col flex'>
            <div className='flex-1 p-8 pt-6'>
                <Categories categories={formattedCategories} />
            </div>
        </div>
    )
}

export default CategoryPage
