import { db } from "@/lib/db";


const getStoreName = async (storeId: string) => {
    try {

        const store = await db.store.findUnique({
            where: {
                id: storeId
            }
        });

        return store?.name;

    } catch (error: any) {
        console.log('No store found.', error);
        return null;
    }
};

export default getStoreName;
