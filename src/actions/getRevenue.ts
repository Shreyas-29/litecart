import { db } from "@/lib/db";


const getRevenue = async (storeId: string) => {
    try {

        const orders = await db.order.findMany({
            where: {
                storeId: storeId,
                isPaid: true
            },
            include: {
                orderItems: {
                    include: {
                        product: true
                    }
                }
            }
        });

        const totalRevenue = orders.reduce((total, order) => {
            const orderTotal = order.orderItems.reduce((orderSum, item) => {
                return orderSum + item.product.price;
            }, 0);
            return total + orderTotal;
        }, 0);

        return totalRevenue;

    } catch (error: any) {
        console.log('Could not calculate revenue.', error);
        return null;
    }
};

export default getRevenue;
