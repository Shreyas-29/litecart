import { CreateStore } from '@/components';

const MainPage = async () => {

    return (
        <div className='flex items-center justify-center h-full'>
            {/* @ts-ignore */}
            <CreateStore disable border />
        </div>
    )
}

export default MainPage
