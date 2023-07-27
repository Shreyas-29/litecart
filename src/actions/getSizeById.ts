import { db } from "@/lib/db";

const getSizeById = async (sizeId: string) => {
    try {

        const size = await db.size.findUnique({
            where: {
                id: sizeId
            }
        });

        return size;

    } catch (error: any) {
        console.log('No size found.', error);
        return null;
    }
};

export default getSizeById;
