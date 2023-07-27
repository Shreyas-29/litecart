"use client";

import { Button } from '@/components';
import { toast } from '@/components/hooks/use-toast';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { CreateStorePayload, StoreValidator } from '@/lib';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { FC } from 'react';
import { useForm } from 'react-hook-form';


interface CreateStoreProps {
    open?: boolean;
    disable?: boolean;
    border?: boolean;
    setOpen: (open: boolean) => void;
    storeId?: string;
}


const CreateStore: FC<CreateStoreProps> = ({
    open,
    disable,
    border,
    setOpen,
    storeId
}) => {

    const router = useRouter();

    const store = useForm<CreateStorePayload>({
        resolver: zodResolver(StoreValidator),
        defaultValues: {
            name: "",
        },
    });

    const { mutate: createStore, isLoading } = useMutation({
        mutationFn: async ({ name }: CreateStorePayload) => {
            const payload: CreateStorePayload = {
                name
            };

            const { data } = await axios.post('/api/stores', payload);
            window.location.assign(`/${data.id}`);
            console.log('data', data);
            return data;
        },
        onError: (error) => {
            if (error instanceof AxiosError) {
                if (error.response?.status === 409) {
                    return toast({
                        title: 'Store name already exists',
                        description: 'Try checking different name.',
                        variant: 'destructive'
                    })
                }

                if (error.response?.status === 422) {
                    return toast({
                        title: 'Something went wrong',
                        description: 'Invalid name, try checking different name.',
                        variant: 'destructive'
                    })
                }
            }

            toast({
                title: 'Something went wrong',
                description: 'Colud not create store, please try again.',
                variant: 'destructive'
            })
        },
        onSuccess: () => {
            toast({
                title: 'Store created!',
                description: 'You can now manage products and orders.',
            });
            store.reset();
            setOpen(!open);
            router.push(`/${storeId}`);
            router.refresh();
        }
    });

    return (
        <Card className={`max-w-lg w-full ${border ? 'border border-slate-200' : 'border-none border-white'} mx-auto`}>
            <CardHeader>
                <CardTitle className='text-xl font-semibold'>
                    Create store
                </CardTitle>
                <CardDescription>
                    Add a new store to manage products and orders.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form
                    onSubmit={store.handleSubmit((e) => createStore(e))}
                    className='grid gap-2'
                >
                    <Label htmlFor="Name">Name</Label>
                    <div className='relative w-full'>
                        <Input
                            id="Name"
                            placeholder='Electronics'
                            {...store.register('name')}
                            disabled={isLoading}
                        />
                    </div>
                    <div className='flex items-center justify-end gap-3 w-full'>
                        <Button
                            type='button'
                            variant='outline'
                            className='!mt-3'
                            disabled={isLoading || disable}
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type='submit'
                            variant='default'
                            className='!mt-3'
                            isLoading={isLoading}
                        >
                            Create
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}

export default CreateStore
