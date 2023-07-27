import { getCurrentUser } from '@/actions';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import UserForm from '../components/UserForm';


const UserSettingsPage = async () => {

    const currentUser = await getCurrentUser();

    if (!currentUser) {
        redirect('/signin');
    }

    const user = await db.user.findUnique({
        where: {
            id: currentUser.id
        }
    });

    return (
        <div className='flex flex-col'>
            <div className='flex-1 p-8 pt-6'>
                <UserForm user={user} />
            </div>
        </div>
    )
}

export default UserSettingsPage
