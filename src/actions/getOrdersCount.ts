import { db } from "@/lib/db";


const getOrdersCount = async (storeId: string) => {
    try {

        const count = await db.order.count({
            where: {
                storeId: storeId,
                isPaid: true
            }
        });

        return count;

    } catch (error: any) {
        console.log('No order found.', error);
        return null;
    }
};

export default getOrdersCount;
