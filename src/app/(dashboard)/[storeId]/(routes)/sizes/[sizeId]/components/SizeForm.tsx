"use client";

import { zodResolver } from '@hookform/resolvers/zod';
import { Size } from '@prisma/client';
import { useParams, useRouter } from 'next/navigation';
import React, { FC, useState } from 'react'
import { useForm } from 'react-hook-form'
import axios, { AxiosError } from 'axios';
import { toast } from '@/components/hooks/use-toast';
import { Button, DeleteModal, Header, Modal } from '@/components';
import { Trash } from 'lucide-react';
import { Separator } from '@/components/ui/Separator';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/Form';
import { Input } from '@/components/ui/Input';
import { SizeValidator, CreateSizePayload } from '@/lib';
import { useMutation } from '@tanstack/react-query';


interface SizeFormProps {
    initialData: Size | null;
};

const SizeForm: FC<SizeFormProps> = ({
    initialData
}) => {

    const params = useParams();

    const { storeId, sizeId } = params;

    const router = useRouter();

    const [open, setOpen] = useState(false);
    // const [loading, setLoading] = useState(false);

    const title = initialData ? 'Edit Size' : 'Create Size';
    const subTitle = initialData ? 'Edit a size' : 'Add a new size';
    const toastMessage = initialData ? 'Size updated' : 'Size created';
    const button = initialData ? 'Update' : 'Create';

    const form = useForm({
        resolver: zodResolver(SizeValidator),
        defaultValues: initialData || {
            name: ''
        }
    });

    // const onSubmit = async (data: CreateSizePayload) => {
    //     try {
    //         setLoading(true);

    //         if (initialData) {
    //             await axios.patch(`/api/${storeId}/sizes/${sizeId}`, data);
    //         } else {
    //             await axios.post(`/api/${storeId}/sizes`, data);
    //         }
    //         router.refresh();
    //         router.push(`/${storeId}/sizes`);

    //         toast({
    //             description: toastMessage,
    //         });
    //     } catch (error) {
    //         if (error instanceof AxiosError) {
    //             if (error.response?.status === 405) {
    //                 toast({
    //                     title: 'Action not allowed',
    //                     description: 'You are not allowed to perform this action.',
    //                     variant: 'destructive'
    //                 });
    //             }

    //             if (error.response?.status === 422) {
    //                 toast({
    //                     title: 'Invalid name',
    //                     description: 'Try a different name.',
    //                     variant: 'destructive'
    //                 });
    //             }
    //         }

    //         toast({
    //             title: 'Something went wrong',
    //             description: 'Could not create size.',
    //             variant: 'destructive'
    //         });
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    // const handleDelete = async () => {
    //     setLoading(true);
    //     try {

    //         await axios.delete(`/api/${storeId}/sizes/${sizeId}`);
    //         router.refresh();
    //         router.push(`/${storeId}/sizes`);

    //         toast({
    //             description: 'Size deleted successfully.',
    //         });

    //     } catch (error) {
    //         if (error instanceof AxiosError) {
    //             if (error.response?.status === 405) {
    //                 return toast({
    //                     title: 'Action not allowed',
    //                     description: 'You are not allowed to perform this action.',
    //                     variant: 'destructive'
    //                 });
    //             }

    //             if (error.response?.status === 422) {
    //                 return toast({
    //                     title: 'Size not found',
    //                     description: 'Could not find the size.',
    //                     variant: 'destructive'
    //                 });
    //             }
    //         }

    //         toast({
    //             title: 'Something went wrong',
    //             description: 'Could not delete size.',
    //             variant: 'destructive'
    //         });
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const { mutate: createSize, isLoading } = useMutation({
        mutationFn: async ({ name, value }: CreateSizePayload) => {
            const payload: CreateSizePayload = {
                name,
                value
            }

            const { data } = initialData ?
                await axios.patch(`/api/${storeId}/sizes/${sizeId}`, payload)
                : await axios.post(`/api/${storeId}/sizes`, payload);
            return data;
        },
        onError: (error) => {
            if (error instanceof AxiosError) {
                if (error.response?.status === 403) {
                    return toast({
                        title: 'You cannot delete this size',
                        description: 'This size is being used by one or more products.',
                        variant: 'destructive'
                    })
                }

                if (error.response?.status === 409) {
                    return toast({
                        title: 'Size already exists',
                        description: 'Try checking diffrerent name.',
                        variant: 'destructive'
                    })
                }

                if (error.response?.status === 422) {
                    return toast({
                        title: 'Size not found',
                        description: 'This size does not exist.',
                        variant: 'destructive'
                    })
                }
            }

            toast({
                title: 'There was a problem',
                description: 'Could not create size, please try again.',
                variant: 'destructive'
            })
        },
        onSuccess: () => {
            toast({
                description: toastMessage,
            });
            router.push(`/${storeId}/sizes`);
            router.refresh();
        }
    });

    const { mutate: deleteSize, isLoading: loading } = useMutation({
        mutationFn: async () => {
            const { data } = await axios.delete(`/api/${storeId}/sizes/${sizeId}`);
            return data;
        },
        onError: (error) => {
            if (error instanceof AxiosError) {
                if (error.response?.status === 403) {
                    return toast({
                        title: 'You cannot delete this size',
                        description: 'This size is being used by one or more products.',
                        variant: 'destructive'
                    })
                }

                if (error.response?.status === 422) {
                    return toast({
                        title: 'Size not found',
                        description: 'This size does not exist, please try again.',
                        variant: 'destructive'
                    })
                }
            }

            toast({
                title: 'There was a problem',
                description: 'Could not delete size, please try again.',
                variant: 'destructive'
            })
        },
        onSuccess: () => {
            toast({
                description: 'Size deleted successfully.',
            });
            router.push(`/${storeId}/sizes`);
            router.refresh();
        }
    });


    return (
        <div className='flex items-center flex-col justify-start w-full space-y-4'>
            <div className='flex items-center justify-between w-full'>
                <DeleteModal
                    title='size'
                    open={open}
                    loading={loading}
                    handleDelete={deleteSize}
                    handleClose={() => setOpen(false)}
                />
                <Header
                    title={title}
                    subtitle={subTitle}
                />
                {initialData ? (
                    <Button
                        isLoading={loading}
                        variant='destructive'
                        size='button'
                        onClick={() => setOpen(true)}
                    >
                        {loading ? null : <Trash className='w-4 h-4 text-current' />}
                    </Button>
                ) : null}
            </div>
            <Separator />
            <Form {...form}>
                <form onSubmit={form.handleSubmit((e) => createSize(e))} className="space-y-8 w-full">
                    <div className="md:grid md:grid-cols-3 gap-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            disabled={isLoading}
                                            placeholder="Size name"
                                            className='capitalize placeholder:normal-case'
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="value"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Value</FormLabel>
                                    <FormControl>
                                        <div className='flex items-center gap-4'>
                                            <Input
                                                {...field}
                                                disabled={isLoading}
                                                placeholder="Size value"
                                                className='capitalize placeholder:normal-case'
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button isLoading={isLoading} className="ml-auto" type="submit">
                        {button}
                    </Button>
                </form>
            </Form>
        </div>
    )
}

export default SizeForm
