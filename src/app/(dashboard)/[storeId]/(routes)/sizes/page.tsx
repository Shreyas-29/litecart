import { db } from '@/lib/db';
import { format } from 'date-fns';
import { SizeColumn } from './components/SizeColumn';
import Sizes from './components/Sizes';


const SizesPage = async ({
    params
}: {
    params: { storeId: string }
}) => {

    const sizes = await db.size.findMany({
        where: {
            storeId: params.storeId
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    const formattedSizes: SizeColumn[] = sizes.map((size) => ({
        id: size.id,
        name: size.name,
        value: size.value,
        createdAt: format(size.createdAt, 'do MMMM, yyyy')
    }));

    return (
        <div className='flex-col'>
            <div className='flex-1 p-8 pt-6'>
                <Sizes sizes={formattedSizes} />
            </div>
        </div>
    )
}

export default SizesPage
