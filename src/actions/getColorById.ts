import { db } from "@/lib/db";

const getColorById = async (colorId: string) => {
    try {

        const color = await db.color.findUnique({
            where: {
                id: colorId
            }
        });

        return color;

    } catch (error: any) {
        console.log('No color found.', error);
        return null;
    }
};

export default getColorById;
