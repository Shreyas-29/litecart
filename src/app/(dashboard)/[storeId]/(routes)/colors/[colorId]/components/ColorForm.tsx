"use client";

import { Button, DeleteModal, Header } from '@/components';
import { toast } from '@/components/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/Form';
import { Input } from '@/components/ui/Input';
import { Separator } from '@/components/ui/Separator';
import { ColorValidator, CreateColorPayload } from '@/lib';
import { zodResolver } from '@hookform/resolvers/zod';
import { Color } from '@prisma/client';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { Trash } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';


interface ColorFormProps {
    initialData: Color | null;
};

const ColorForm: FC<ColorFormProps> = ({
    initialData
}) => {

    const params = useParams();

    const { storeId, colorId } = params;

    const router = useRouter();

    const [open, setOpen] = useState(false);
    // const [loading, setLoading] = useState(false);

    const title = initialData ? 'Edit Color' : 'Create Color';
    const subTitle = initialData ? 'Edit a color' : 'Add a new color';
    const toastMessage = initialData ? 'Color updated' : 'Color created';
    const button = initialData ? 'Update' : 'Create';

    const form = useForm({
        resolver: zodResolver(ColorValidator),
        defaultValues: initialData || {
            name: ''
        }
    });

    const { mutate: createColor, isLoading } = useMutation({
        mutationFn: async ({ name, value }: CreateColorPayload) => {
            const payload: CreateColorPayload = {
                name,
                value
            }

            const { data } = initialData ?
                await axios.patch(`/api/${storeId}/colors/${colorId}`, payload)
                : await axios.post(`/api/${storeId}/colors`, payload);
            return data;
        },
        onError: (error) => {
            if (error instanceof AxiosError) {
                if (error.response?.status === 403) {
                    return toast({
                        title: 'You cannot delete this color',
                        description: 'This color is being used by one or more products.',
                        variant: 'destructive'
                    })
                }

                if (error.response?.status === 409) {
                    return toast({
                        title: 'Color already exists',
                        description: 'Try checking diffrerent name.',
                        variant: 'destructive'
                    })
                }

                if (error.response?.status === 422) {
                    return toast({
                        title: 'Color not found',
                        description: 'This color does not exist.',
                        variant: 'destructive'
                    })
                }
            }

            toast({
                title: 'There was a problem',
                description: 'Could not create color, please try again.',
                variant: 'destructive'
            })
        },
        onSuccess: () => {
            toast({
                description: toastMessage,
            });
            router.push(`/${storeId}/colors`);
            router.refresh();
        }
    });

    const { mutate: deleteColor, isLoading: loading } = useMutation({
        mutationFn: async () => {
            const { data } = await axios.delete(`/api/${storeId}/colors/${colorId}`);
            return data;
        },
        onError: (error) => {
            if (error instanceof AxiosError) {
                if (error.response?.status === 403) {
                    return toast({
                        title: 'You cannot delete this color',
                        description: 'This color is being used by one or more products.',
                        variant: 'destructive'
                    })
                }

                if (error.response?.status === 422) {
                    return toast({
                        title: 'Color not found',
                        description: 'This color does not exist, please try again.',
                        variant: 'destructive'
                    })
                }
            }

            toast({
                title: 'There was a problem',
                description: 'Could not delete color, please try again.',
                variant: 'destructive'
            })
        },
        onSuccess: () => {
            toast({
                description: 'Color deleted successfully.',
            });
            router.push(`/${storeId}/colors`);
            router.refresh();
        }
    });

    return (
        <div className='flex items-center flex-col justify-start w-full space-y-4'>
            <div className='flex items-center justify-between w-full'>
                <DeleteModal
                    title='color'
                    open={open}
                    loading={loading}
                    handleDelete={deleteColor}
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
                <form
                    onSubmit={form.handleSubmit((e) => createColor(e))}
                    className="space-y-8 w-full"
                >
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
                                            placeholder="Color name"
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
                                                placeholder="Color value"
                                                className='uppercase placeholder:normal-case'
                                            />
                                            <div
                                                className='border border-gray-300 p-4 rounded-full'
                                                style={{ backgroundColor: field.value }}
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

export default ColorForm
