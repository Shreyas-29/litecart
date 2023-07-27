import { db } from '@/lib/db';
import { format } from 'date-fns';
import { ColorColumn } from './components/ColorColumn';
import Colors from './components/Colors';


const ColorsPage = async ({
    params
}: {
    params: { storeId: string }
}) => {

    const colors = await db.color.findMany({
        where: {
            storeId: params.storeId
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    const formattedColors: ColorColumn[] = colors.map((color) => ({
        id: color.id,
        name: color.name,
        value: color.value,
        createdAt: format(color.createdAt, 'do MMMM, yyyy')
    }));

    return (
        <div className='flex-col'>
            <div className='flex-1 p-8 pt-6'>
                <Colors colors={formattedColors} />
            </div>
        </div>
    )
}

export default ColorsPage
