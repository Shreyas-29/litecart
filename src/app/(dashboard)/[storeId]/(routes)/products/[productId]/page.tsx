import { db } from '@/lib/db';
import { z } from 'zod';
import ProductForm from './components/ProductForm';


// const prodcutIdSchema = z.string().regex(/^[0-9a-zA-Z]{24}$/).length(12);
const prodcutIdSchema = z.string().regex(/^(?![a-zA-Z]+$).{12}$/);


const CreateProduct = async ({
    params
}: {
    params: { productId: string, storeId: string }
}) => {

    const { productId, storeId } = params;

    const isValidProductId = prodcutIdSchema.safeParse(productId).success;

    const categories = await db.category.findMany({
        where: {
            storeId: params.storeId,
        },
    });

    const sizes = await db.size.findMany({
        where: {
            storeId: params.storeId,
        },
    });

    const colors = await db.color.findMany({
        where: {
            storeId: params.storeId,
        },
    });

    if (!isValidProductId) {
        return (
            <div className='flex-col'>
                <div className='flex-1 p-8 pt-6'>
                    <ProductForm
                        categories={categories}
                        colors={colors}
                        sizes={sizes}
                    />
                </div>
            </div>
        )
    }

    const product = await db.product.findUnique({
        where: {
            id: params.productId,
        },
        include: {
            images: true,
        }
    });

    if (!product) {
        return (
            <div className='flex-col'>
                <div className='flex-1 p-8 pt-6'>
                    <ProductForm
                        categories={categories}
                        colors={colors}
                        sizes={sizes}
                        initialData={product}
                    />
                </div>
            </div>
        )
    }

    return (
        <div className='flex-col'>
            <div className='flex-1 p-8 pt-6'>
                <ProductForm
                    categories={categories}
                    colors={colors}
                    sizes={sizes}
                    initialData={product}
                />
            </div>
        </div>
    )
}

export default CreateProduct
