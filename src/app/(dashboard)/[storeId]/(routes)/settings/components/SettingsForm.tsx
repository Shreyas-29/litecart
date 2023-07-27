"use client";

import { Button, DeleteModal, Header } from '@/components';
import { toast } from '@/components/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/Form';
import { Input } from '@/components/ui/Input';
import { Separator } from '@/components/ui/Separator';
import { CreateStorePayload, StoreValidator } from '@/lib';
import { zodResolver } from '@hookform/resolvers/zod';
import { Store } from '@prisma/client';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { Trash } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';


interface SettingsFormProps {
    initialData: Store;
}

const SettingsForm: FC<SettingsFormProps> = ({
    initialData
}) => {

    const params = useParams();
    const router = useRouter();

    const [open, setOpen] = useState(false);

    const form = useForm<CreateStorePayload>({
        resolver: zodResolver(StoreValidator),
        defaultValues: initialData
    });

    // const handleDelete = async () => {
    //     try {
    //         setLoading(true);

    //         await axios.delete(`/api/stores/${params.storeId}`);
    //         router.refresh();
    //         router.push('/');

    //         toast({
    //             description: 'Store deleted!'
    //         });

    //     } catch (error) {
    //         toast({
    //             title: 'Permission denied',
    //             description: 'Remove all the categories and products from this store',
    //             variant: 'destructive'
    //         })
    //     }
    // };

    const { mutate: deleteStore, isLoading } = useMutation({
        mutationFn: async () => {

            const { data } = await axios.delete(`/api/stores/${params.storeId}`);
            return data;
        },
        onError: (error) => {
            if (error instanceof AxiosError) {
                if (error.response?.status === 422) {
                    return toast({
                        title: 'Store not found',
                        description: 'This store does not exist',
                        variant: 'destructive'
                    })
                }
            }

            toast({
                title: 'There was a problem',
                description: 'Could not delete store, please try again.',
                variant: 'destructive'
            })
        },
        onSuccess: () => {
            toast({
                title: 'Store deleted!',
                description: 'Your store has been deleted.',
            });
            setOpen(false);
            router.push('/');
            router.refresh();
        }
    });


    return (
        <div className='flex flex-col items-start space-y-4 w-full'>
            <DeleteModal
                title='store'
                handleClose={() => setOpen(false)}
                handleDelete={deleteStore}
                loading={isLoading}
                open={open}
            />
            <div className='flex items-start justify-between w-full'>
                <Header title='Store Settings' subtitle='Manage your store settings' />
                <Button
                    variant='destructive'
                    size='button'
                    onClick={() => setOpen(true)}
                >
                    <Trash className='w-5 h-5' />
                </Button>
            </div>
            <Separator />
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit((e: any) => deleteStore(e))}
                    className='w-full space-y-8'
                >
                    <div className='md:grid md:grid-cols-3 gap-8'>
                        <FormField
                            control={form.control}
                            name='name'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Name
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder='Store name'
                                            disabled={isLoading}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button isLoading={isLoading} className='ml-auto'>
                        Save changes
                    </Button>
                </form>
            </Form>
        </div>
    )
}

export default SettingsForm
