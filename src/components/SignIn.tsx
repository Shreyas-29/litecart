import AuthForm from './AuthForm'

const SignIn = () => {
    return (
        <div className='container flex flex-col items-center justify-center w-full mx-auto space-y-6'>
            <div className='flex flex-col space-y-3 text-center w-full'>
                <AuthForm />
            </div>
        </div>
    )
}

export default SignIn
