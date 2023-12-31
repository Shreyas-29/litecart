import { db } from "@/lib/db";

const getCategoryById = async (categoryId: string) => {
    try {

        const category = await db.category.findUnique({
            where: {
                id: categoryId
            }
        });

        return category;

    } catch (error: any) {
        console.log('No category found.', error);
        return null;
    }
};

export default getCategoryById;
