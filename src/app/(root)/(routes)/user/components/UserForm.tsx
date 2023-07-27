"use client";

import { toast } from "@/components/hooks/use-toast";
import { UpdateUserPayload, UserValidator, cn } from "@/lib";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { ImagePlus, Trash } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/Form';
import { Input } from '@/components/ui/Input';
import { Separator } from '@/components/ui/Separator';
import { Button, DeleteModal, Header, ImageButton } from '@/components';
import { useSession } from "next-auth/react";
import { CldUploadButton } from "next-cloudinary";
import { buttonVariants } from "@/components/ui/Button";
import Image from "next/image";


interface UserFormProps {
    user: User | null;
}

const UserForm: FC<UserFormProps> = ({
    user
}) => {

    const router = useRouter();

    const { data: session } = useSession();

    const [url, seturl] = useState<string>("");

    const form = useForm<UpdateUserPayload>({
        resolver: zodResolver(UserValidator),
        defaultValues: {
            username: user?.username ? user?.username : '',
            image: user?.image ? user?.image : '',
        }
    });

    const { mutate: updateUser, isLoading } = useMutation({
        mutationFn: async ({ username, image }: UpdateUserPayload) => {
            const payload: UpdateUserPayload = {
                username,
                image
            };

            const { data } = await axios.patch('/api/user', payload);
            return data;
        },
        onError(error) {
            if (error instanceof AxiosError) {
                if (error.response?.status === 404) {
                    return toast({
                        title: 'Access denied',
                        description: 'Unable to update this user, please try again.',
                        variant: 'destructive'
                    })
                }

                if (error.response?.status === 422) {
                    return toast({
                        title: 'Something went wrong',
                        description: 'Please check your details and try again.',
                        variant: 'destructive'
                    })
                }
            }

            toast({
                title: 'There was a problem',
                description: 'Could not update details, please try again.',
                variant: 'destructive'
            })
        },
        onSuccess() {
            toast({
                description: 'Your profile was updated.',
            })
            form.reset();
            seturl("");
            router.refresh();
        },
    });

    const handleUpload = (result: any) => {
        const image = result?.info?.secure_url;

        if (image) {
            form.setValue('image', image);
            form.trigger('image');
            seturl(image);
        }
    };

    return (
        <div className='flex flex-col items-start space-y-4 w-full'>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit((e: any) => updateUser(e))}
                    className='w-full space-y-8'
                >
                    <div className="flex flex-col md:flex-row items-start gap-8">
                        <div className='md:grid gap-8 max-w-[230px]'>
                            <FormField
                                control={form.control}
                                name='username'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Username
                                        </FormLabel>
                                        <FormControl className="relative">
                                            <div className="relative w-full">
                                                <span className='bg-white text-slate-500 text-current absolute px-2 inset-y-1 pt-1 left-1 h-max'>@</span>
                                                <Input
                                                    {...field}
                                                    value={field.value}
                                                    placeholder={`${session?.user?.name?.toLowerCase()}`}
                                                    disabled={isLoading}
                                                    className="pl-9"
                                                />
                                                {form.formState.errors.username && (
                                                    <span className="text-red-500 text-sm mt-1">
                                                        {form.formState.errors.username.message}
                                                    </span>
                                                )}
                                            </div>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='image'
                                render={({ field }) => (
                                    <FormItem className="flex-col items-start flex">
                                        <FormLabel>
                                            Profile Image
                                        </FormLabel>
                                        <CldUploadButton
                                            options={{ maxFiles: 1 }}
                                            onUpload={handleUpload}
                                            uploadPreset='ssqanesp'
                                        >
                                            <span className={cn(buttonVariants({ variant: 'secondary', size: 'lg', className: '!mt-2' }))}>
                                                <ImagePlus className="w-4 h-4 mr-2" />
                                                <span>Upload Image</span>
                                            </span>
                                        </CldUploadButton>
                                        {form.formState.errors.image && (
                                            <span className="text-red-500 text-sm mt-1">
                                                {form.formState.errors.image.message}
                                            </span>
                                        )}
                                    </FormItem>
                                )}
                            />
                        </div>
                        {url && (
                            <div className="relative">
                                <Image
                                    src={url}
                                    alt="Product"
                                    className="w-48 h-48 object-cover rounded-md"
                                    width={1000}
                                    height={1000}
                                />
                                <Button
                                    type="button"
                                    variant='destructive'
                                    disabled={isLoading}
                                    size='button'
                                    className="absolute top-2 right-2"
                                    onClick={() => seturl('')}
                                >
                                    <Trash className="w-4 h-4 text-current" />
                                </Button>
                            </div>
                        )}
                    </div>
                    <Button isLoading={isLoading} className='ml-auto' type="submit">
                        Save changes
                    </Button>
                </form>
            </Form>
        </div>
    );
}

export default UserForm;