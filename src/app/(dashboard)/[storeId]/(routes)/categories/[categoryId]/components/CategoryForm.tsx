"use client";

import { zodResolver } from '@hookform/resolvers/zod';
import { Category } from '@prisma/client';
import { useParams, useRouter } from 'next/navigation';
import React, { FC, useState } from 'react'
import { z } from 'zod';
import { useForm } from 'react-hook-form'
import axios, { AxiosError } from 'axios';
import { toast } from '@/components/hooks/use-toast';
import { Button, DeleteModal, Header, Modal } from '@/components';
import { Trash } from 'lucide-react';
import { Separator } from '@/components/ui/Separator';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/Form';
import { Input } from '@/components/ui/Input';
import { CategoryValidator, CreateCategoryPayload } from '@/lib';
import { useMutation } from '@tanstack/react-query';



interface CategoryFormProps {
    initialData: Category | null;
};

const CategoryForm: FC<CategoryFormProps> = ({
    initialData
}) => {

    const params = useParams();

    const { storeId, categoryId } = params;

    const router = useRouter();

    const [open, setOpen] = useState(false);
    // const [loading, setLoading] = useState(false);

    const title = initialData ? 'Edit Category' : 'Create Category';
    const subTitle = initialData ? 'Edit a category' : 'Add a new category';
    const toastMessage = initialData ? 'Category updated' : 'Category created';
    const button = initialData ? 'Update' : 'Create';

    const form = useForm({
        resolver: zodResolver(CategoryValidator),
        defaultValues: initialData || {
            name: ''
        }
    });

    const { mutate: createCategory, isLoading } = useMutation({
        mutationFn: async ({ name }: CreateCategoryPayload) => {
            const payload: CreateCategoryPayload = {
                name
            }

            const { data } = initialData ?
                await axios.patch(`/api/${storeId}/categories/${categoryId}`, payload)
                : await axios.post(`/api/${storeId}/categories`, payload);
            return data;
        },
        onError: (error) => {
            if (error instanceof AxiosError) {
                if (error.response?.status === 403) {
                    return toast({
                        title: 'You cannot delete this category',
                        description: 'This category is being used by one or more products.',
                        variant: 'destructive'
                    })
                }

                if (error.response?.status === 409) {
                    return toast({
                        title: 'Category already exists',
                        description: 'Try checking diffrerent name.',
                        variant: 'destructive'
                    })
                }

                if (error.response?.status === 422) {
                    return toast({
                        title: 'Category not found',
                        description: 'This category does not exist.',
                        variant: 'destructive'
                    })
                }
            }

            toast({
                title: 'There was a problem',
                description: 'Could not create category, please try again.',
                variant: 'destructive'
            })
        },
        onSuccess: () => {
            toast({
                description: toastMessage,
            });
            router.push(`/${storeId}/categories`);
            router.refresh();
        }
    });

    const { mutate: deleteCategory, isLoading: loading } = useMutation({
        mutationFn: async () => {
            const { data } = await axios.delete(`/api/${storeId}/categories/${categoryId}`);
            return data;
        },
        onError: (error) => {
            if (error instanceof AxiosError) {
                if (error.response?.status === 403) {
                    return toast({
                        title: 'You cannot delete this category',
                        description: 'This category is being used by one or more products.',
                        variant: 'destructive'
                    })
                }

                if (error.response?.status === 422) {
                    return toast({
                        title: 'Category not found',
                        description: 'This category does not exist, please try again.',
                        variant: 'destructive'
                    })
                }
            }

            toast({
                title: 'There was a problem',
                description: 'Could not delete category, please try again.',
                variant: 'destructive'
            })
        },
        onSuccess: () => {
            toast({
                description: 'Category deleted successfully.',
            });
            router.push(`/${storeId}/categories`);
            router.refresh();
        }
    });


    return (
        <div className='flex items-center flex-col justify-start w-full space-y-4'>
            <div className='flex items-center justify-between w-full'>
                <DeleteModal
                    title='category'
                    open={open}
                    loading={loading}
                    handleDelete={deleteCategory}
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
                    onSubmit={form.handleSubmit((e) => createCategory(e))}
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
                                            placeholder="Category name"
                                            className='capitalize'
                                        />
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

export default CategoryForm
