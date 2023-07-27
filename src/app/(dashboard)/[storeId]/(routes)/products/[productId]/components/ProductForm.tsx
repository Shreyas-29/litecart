"use client";

import { Button, DeleteModal, Header, ImageButton } from '@/components';
import { toast } from '@/components/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/Form';
import { Input } from '@/components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Separator } from '@/components/ui/Separator';
import { Textarea } from '@/components/ui/Textarea';
import { CreateProductPayload, ProductValidator } from '@/lib';
import { zodResolver } from '@hookform/resolvers/zod';
import { Category, Color, Image, Product, Size } from '@prisma/client';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { Trash } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';

interface ProductFormProps {
    initialData?: Product & {
        images: Image[]
    } | null;
    categories: Category[];
    sizes: Size[];
    colors: Color[];
};


const ProductForm: FC<ProductFormProps> = ({
    initialData,
    categories,
    sizes,
    colors
}) => {

    const params = useParams();

    const router = useRouter();

    const { productId, storeId } = params;

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initialData ? 'Edit Product' : 'Create Product';
    const subTitle = initialData ? 'Edit a product' : 'Add a new product';
    const toastMessage = initialData ? 'Product updated' : 'Product created';
    const button = initialData ? 'Update' : 'Create';

    const defaultValues = initialData ? {
        ...initialData,
        stock: parseFloat(String(initialData.stock)),
        price: parseFloat(String(initialData.price)),
    } : {
        name: '',
        images: [],
        categoryId: '',
        colorId: '',
        sizeId: '',
        brand: '',
        description: ''
    };

    const form = useForm<CreateProductPayload>({
        resolver: zodResolver(ProductValidator),
        defaultValues,
    });

    const { mutate: createProduct, isLoading } = useMutation({
        mutationFn: async ({
            name,
            images,
            categoryId,
            colorId,
            sizeId,
            price,
            stock,
            brand,
            description
        }: CreateProductPayload) => {
            const payload: CreateProductPayload = {
                name,
                images,
                categoryId,
                colorId,
                sizeId,
                price,
                stock,
                brand,
                description
            };

            const { data } = initialData ?
                await axios.patch(`/api/${storeId}/products/${productId}`, payload)
                : await axios.post(`/api/${storeId}/products`, payload);
            return data;
        },
        onError: (error) => {
            if (error instanceof AxiosError) {
                if (error.response?.status === 405) {
                    toast({
                        title: 'You cannot delete this product',
                        description: 'This product is being used by one or more products',
                        variant: 'destructive'
                    })
                }

                if (error.response?.status === 422) {
                    toast({
                        title: 'Product id not found',
                        description: 'This product does not exist',
                        variant: 'destructive'
                    })
                }
            }

            toast({
                title: 'There was a problem',
                description: 'Something went wrong, please try again.',
                variant: 'destructive'
            })
        },
        onSuccess: () => {
            toast({
                description: toastMessage,
            });
            router.push(`/${storeId}/products`);
            router.refresh();
        }
    });

    const handleDelete = () => { };
    // createProduct

    return (
        <div className='flex items-center flex-col justify-start w-full space-y-4'>
            <div className='flex items-center justify-between w-full'>
                <DeleteModal
                    title='product'
                    open={open}
                    loading={loading}
                    handleDelete={handleDelete}
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
                        <Trash className='w-4 h-4 text-current' />
                    </Button>
                ) : null}
            </div>
            <Separator />
            <Form {...form}>
                <form onSubmit={form.handleSubmit((e) => createProduct(e))} className="space-y-8 w-full">
                    <FormField
                        control={form.control}
                        name="images"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Images</FormLabel>
                                <FormControl>
                                    <ImageButton
                                        value={field.value.map((image) => image.url)}
                                        disabled={isLoading}
                                        onChange={(url: string) => field.onChange([...field.value, { url }])}
                                        onDelete={(url: string) => field.onChange([...field.value.filter((current) => current.url !== url)])}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
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
                                            placeholder="Product name"
                                            className='capitalize'
                                            type='text'
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="categoryId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <Select
                                        disabled={isLoading}
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue defaultValue={field.value} placeholder="Select a category" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {categories?.map((category) => (
                                                <SelectItem key={category.id} value={category.id}>
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="colorId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Color</FormLabel>
                                    <Select
                                        disabled={isLoading}
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue defaultValue={field.value} placeholder="Select a color" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {colors?.map((color) => (
                                                <SelectItem key={color.id} value={color.id}>
                                                    {color.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="sizeId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Size</FormLabel>
                                    <Select
                                        disabled={isLoading}
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue defaultValue={field.value} placeholder="Select a size" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {sizes?.map((size) => (
                                                <SelectItem key={size.id} value={size.id}>
                                                    {size.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="stock"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Products in Stock</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            disabled={isLoading}
                                            placeholder="1"
                                            className='capitalize'
                                            type='number'
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Price</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            disabled={isLoading}
                                            placeholder="99"
                                            className='capitalize'
                                            type='number'
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className='grid grid-cols-2 lg:grid-cols-3 w-full gap-8'>
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem className='col-span-1 lg:col-span-2'>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            disabled={isLoading}
                                            placeholder="About the product"
                                            className='p-3 min-h-[30px] resize-none'
                                            rows={1}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="brand"
                            render={({ field }) => (
                                <FormItem className='col-span-1 lg:col-span-1'>
                                    <FormLabel>Brand name</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            disabled={isLoading}
                                            placeholder="Brand name"
                                            className='capitalize'
                                            type='text'
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

export default ProductForm
