import { getCurrentUser } from '@/actions';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import SettingsForm from './components/SettingsForm';


const SettingsPage = async ({
    params
}: {
    params: { storeId: string }
}) => {

    const currentUser = await getCurrentUser();

    if (!currentUser) {
        redirect('/signin');
    }

    const store = await db.store.findFirst({
        where: {
            id: params.storeId,
            userId: currentUser.id
        }
    });

    if (!store) {
        redirect('/');
    }

    return (
        <div className='flex flex-col'>
            <div className='flex-1 space-y-4 p-8 pt-6'>
                <SettingsForm initialData={store} />
            </div>
        </div>
    )
}

export default SettingsPage
