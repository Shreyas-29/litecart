import { db } from "@/lib/db";

const getProductById = async (productId: string, storeId: string) => {
    try {

        const product = await db.product.findUnique({
            where: {
                id: productId
            },
            include: {
                images: true
            }
        });

        const categories = await db.category.findMany({
            where: {
                storeId: storeId
            }
        });

        const sizes = await db.size.findMany({
            where: {
                storeId: storeId
            }
        });

        const colors = await db.color.findMany({
            where: {
                storeId: storeId,
            },
        });

        return { product, categories, sizes, colors } || null;

    } catch (error: any) {
        console.log('No data found.', error);
        return null;
    }
};

export default getProductById;
