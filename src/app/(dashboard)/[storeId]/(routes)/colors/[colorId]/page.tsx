import { getColorById } from '@/actions';
import { z } from 'zod';
import ColorForm from './components/ColorForm';


const colorIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/).length(12);

const CreateColors = async ({
    params
}: {
    params: { colorId: string, storeId: string }
}) => {

    const { colorId, storeId } = params;

    const isValidColorId = colorIdSchema.safeParse(colorId).success;

    const color = await getColorById(colorId);

    if (!isValidColorId) {
        return (
            <div className='flex-col'>
                <div className='flex-1 p-8 pt-6'>
                    <ColorForm initialData={color} />
                </div>
            </div>
        )
    }

    if (!color) {
        <div className='flex-col'>
            <div className='flex-1 p-8 pt-6'>
                <ColorForm initialData={color} />
            </div>
        </div>
    }

    return (
        <div className='flex-col'>
            <div className='flex-1 p-8 pt-6'>
                <ColorForm initialData={color} />
            </div>
        </div>
    )
}

export default CreateColors
