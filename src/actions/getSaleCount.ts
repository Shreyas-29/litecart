import { db } from "@/lib/db";


const getSaleCount = async (storeId: string) => {
    try {

        const count = await db.order.count({
            where: {
                storeId: storeId,
                isPaid: true
            }
        });

        return count;

    } catch (error: any) {
        console.log('No sales found.', error);
        return null;
    }
};

export default getSaleCount;
