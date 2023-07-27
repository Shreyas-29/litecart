import { Box, Loader2 } from 'lucide-react'

const Loader = () => {
    return (
        <div className='relative flex items-center justify-center max-h-full mx-auto w-full flex-col'>
            <div className='flex items-center justify-center relative'>
                <Loader2 strokeWidth={0.6} className='animate-spin h-16 w-16 text-primary' />
                <Box strokeWidth={1} className='h-6 w-6 text-gray-600 absolute top-5 left-5' />
            </div>
        </div>
    )
}

export default Loader
