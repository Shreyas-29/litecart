import { SignIn } from '@/components'
import { buttonVariants } from '@/components/ui/Button'
import { cn } from '@/lib'
import { ChevronLeft } from 'lucide-react'
import { Metadata } from 'next'
import Link from "next/link"


export const metadata: Metadata = {
    title: 'Sign In',
    description: 'Sign in to your account',
    icons: {
        icon: [
            '/box.png',
        ]
    }
};

const SignInPage = () => {

    return (
        <div className="absolute inset-0">
            <div className="h-full w-full mx-auto flex flex-col items-center justify-center gap-14">
                <Link href="/" className={cn(buttonVariants({ variant: 'ghost', className: 'hidden items-center' }))}>
                    <ChevronLeft className="w-4 h-4 mr-1.5" />
                    <span>Home</span>
                </Link>

                <SignIn />
            </div>
        </div>
    )
}

export default SignInPage
