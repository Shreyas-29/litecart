import { getCurrentUser } from '@/actions';
import { CreateStore } from '@/components';
import { redirect } from 'next/navigation';

const MainPage = async () => {

    const currnetUser = await getCurrentUser();

    // if (!currnetUser) {
    //     redirect('/signin');
    // }

    return (
        <div className='flex items-center justify-center h-full'>
            {/* @ts-ignore */}
            <CreateStore disable border />
        </div>
    )
}

export default MainPage
