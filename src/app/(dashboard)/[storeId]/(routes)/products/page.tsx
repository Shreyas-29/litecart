import { formatter } from '@/lib';
import { db } from '@/lib/db';
import { format } from 'date-fns';
import { ProductColumn } from './components/ProductColumn';
import Products from './components/Products';


const ProductsPage = async ({
    params
}: {
    params: { storeId: string }
}) => {

    const products = await db.product.findMany({
        where: {
            storeId: params.storeId
        },
        include: {
            category: true,
            color: true,
            size: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    const formattedProducts: ProductColumn[] = products.map((item) => ({
        id: item.id,
        name: item.name,
        price: formatter.format(item.price),
        category: item.category.name,
        size: item.size.name,
        color: item.color.value,
        createdAt: format(item.createdAt, 'do MMMM, yyyy'),
    }));

    return (
        <div className='flex-col'>
            <div className='flex-1 p-8 pt-6'>
                <Products products={formattedProducts} />
            </div>
        </div>
    )
}

export default ProductsPage
