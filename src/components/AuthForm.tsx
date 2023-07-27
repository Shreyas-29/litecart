'use client';

import { toast } from '@/components/hooks/use-toast';
import { RegisterValidator } from '@/lib';
import axios from 'axios';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { FC, ReactNode, useEffect, useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { Icons } from './Icons';
import { Button } from './ui/Button';

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { LoginValidator } from '@/lib/validators/auth';
import { zodResolver } from "@hookform/resolvers/zod";

interface AuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string
}

type AuthType = 'LOGIN' | 'REGISTER';

type ActionType = 'google' | 'github';


const AuthForm: FC<AuthFormProps> = ({
    className,
    ...props
}) => {

    const { data: session, status } = useSession();

    const router = useRouter();

    const [authType, setAuthType] = useState<AuthType>('LOGIN');
    const [loading, setLoading] = useState<boolean>(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [authLoading, setAuthLoading] = useState<boolean>(false);
    const [action, setAction] = useState('');

    const userId = session?.user?.id;

    useEffect(() => {
        if (status === 'authenticated') {
            router.push('/');
        }
    }, [status, router]);

    const handleAuth = async (action: string) => {
        // setAuthLoading(action);
        setAction(action);

        try {
            await signIn(action, {
                redirect: false,
            }).then(() => {

            })
            const result = await signIn(action, {
                redirect: false,
            });

            if (result?.error) {
                toast({
                    title: 'There was a problem',
                    description: 'There was an error while signing in.',
                    variant: 'destructive'
                });
            } else {
                router.push('/');
                router.refresh();
                toast({
                    description: 'You are Logged In!',
                })
            }
        } catch (error) {
            toast({
                title: 'There was a problem',
                description: 'There was an error while signing in with Google.',
                variant: 'destructive'
            });
        } finally {
            setAuthLoading(false);
            setAction('');
        }
    };

    const handleSocialAuth = async (action: string) => {
        setAction(action);

        try {
            await signIn(action, {
                callbackUrl: "/",
                redirect: false
            });
        } catch (error) {
            toast({
                title: 'There was a problem.',
                description: `There was an error signing in with ${action}.`,
                variant: 'destructive',
            })
        } finally {
            setAuthLoading(false);
            setAction('');
        }
    }

    const toggleAuthType = () => {
        setAuthType(authType === 'LOGIN' ? 'REGISTER' : 'LOGIN');
    };

    const { register, handleSubmit, formState: { errors } } = useForm<FieldValues>({
        defaultValues: {
            name: '',
            email: '',
            password: '',
        },
        resolver: zodResolver(authType === 'LOGIN' ? LoginValidator : RegisterValidator),
    });

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        setLoading(true);

        if (authType === 'REGISTER') {
            try {
                await RegisterValidator.parseAsync(data);
                await axios.post('/api/signup', data);
                router.push('/');
                router.refresh();
                toast({
                    description: 'You are Logged In!',
                });
            } catch (error) {
                toast({
                    title: 'There was a problem',
                    description: 'Something went wrong. Try checking your credentials.',
                    variant: 'destructive',
                });
            } finally {
                router.push('/');
                setLoading(false);
            }
        }
        if (authType === 'LOGIN') {
            try {
                await LoginValidator.parseAsync(data);
                const result = await signIn('credentials', {
                    ...data,
                    redirect: false,
                });
                if (result?.error) {
                    toast({
                        title: 'Invalid Credentials',
                        description: 'Please enter correct credentials.',
                        variant: 'destructive',
                    });
                } else {
                    router.push('/');
                    router.refresh();
                    toast({
                        description: 'You are Logged In!',
                    });
                }
            } catch (error) {
                toast({
                    title: 'Invalid Credentials',
                    description: 'Please enter correct credentials.',
                    variant: 'destructive',
                });
            } finally {
                router.push('/');
                setLoading(false);
            }
        }
    };

    return (
        <Card className='w-full max-w-md container mx-auto'>
            <form onSubmit={handleSubmit(onSubmit)} >
                <CardHeader className="space-y-1">
                    <Icons.logo className='w-28 h-10 mb-2 mx-auto' />
                    <CardTitle className="text-2xl">
                        {authType === 'LOGIN' ? 'Welcome back to Litecart' : 'Create an account'}
                    </CardTitle>
                    <CardDescription>
                        Enter your email below to create your account
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="grid grid-cols-2 gap-6">
                        <Button
                            type='button'
                            variant="outline"
                            isLoading={action === 'github'}
                            onClick={(() => handleSocialAuth('github'))}
                        >
                            {authLoading ? null : <Icons.gitHub className="mr-2 h-4 w-4" />}
                            Github
                        </Button>
                        <Button
                            type='button'
                            variant="outline"
                            isLoading={action === 'google'}
                            onClick={(() => handleSocialAuth('google'))}
                        >
                            {authLoading ? null : <Icons.google className="mr-2 h-4 w-4" />}
                            Google
                        </Button>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-muted-foreground">
                                Or continue with
                            </span>
                        </div>
                    </div>
                    {authType === 'REGISTER' && (
                        <div className="grid gap-2">
                            <Label htmlFor="name" className='mr-auto'>Name</Label>
                            <Input
                                id="name"
                                type="name"
                                placeholder="John Doe"
                                value={name}
                                {...register('name', { required: true })}
                                onChange={(e) => setName(e.target.value)}
                            />
                            {errors.name && (
                                <span className="text-red-500 text-xs block text-start">
                                    {errors.name.message as ReactNode}
                                </span>
                            )}
                        </div>
                    )}
                    <div className="grid gap-2">
                        <Label htmlFor="email" className='mr-auto'>Email</Label>
                        <Input
                            id="email"
                            type="email"
                            autoComplete="off"
                            placeholder="john@doe.com"
                            value={email}
                            {...register('email', { required: true })}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {errors.email && (
                            <span className="text-red-500 text-xs block text-start">
                                {errors.email.message as ReactNode}
                            </span>
                        )}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password" className='mr-auto'>Password</Label>
                        <Input
                            id="password"
                            type="password"
                            autoComplete="off"
                            placeholder="**********"
                            value={password}
                            {...register('password', { required: true })}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {errors.password && (
                            <span className="text-red-500 text-xs block text-start">
                                {errors.password.message as ReactNode}
                            </span>
                        )}
                    </div>
                </CardContent>
                <CardFooter className='flex flex-col items-center justify-center'>
                    <Button
                        type='submit'
                        className="w-full"
                        isLoading={loading}
                    >
                        {authType === 'LOGIN' ? 'Continue' : 'Create account'}
                    </Button>
                    <div className='text-center text-sm text-zinc-700 mt-4 flex items-center'>
                        {authType === 'LOGIN' ? 'New to LiteCart?' : 'Already have an account?'}
                        <Button
                            type="button"
                            size='button'
                            variant='link'
                            onClick={toggleAuthType} className='text-zinc-700 hover:text-zinc-900 focus:ring-0'>
                            {authType === 'LOGIN' ? 'Create account' : 'Sign In'}
                        </Button>
                    </div>
                </CardFooter>
            </form>
        </Card>
    )
}

export default AuthForm
