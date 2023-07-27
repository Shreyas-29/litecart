import { db } from "@/lib/db";


const getStockCount = async (storeId: string) => {
    try {

        const count = await db.product.count({
            where: {
                storeId: storeId
            }
        });

        return count;

    } catch (error: any) {
        console.log('Could not get stock.', error);
        return null;
    }
};

export default getStockCount;
