"use client";

import { toast } from "@/components/hooks/use-toast";
import axios, { AxiosError } from "axios";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { FC, useState } from "react";

import { DeleteModal } from "@/components";
import { Button } from "@/components/ui/Button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/DropDownMenu";
import { useMutation } from "@tanstack/react-query";
import { CategoryColumn } from "./CategoryColumn";

interface CategoryCellProps {
    category: CategoryColumn;
}

const CategoryCell: FC<CategoryCellProps> = ({
    category
}) => {

    const params = useParams();

    const router = useRouter();

    const [open, setOpen] = useState(false);

    const { mutate: deleteCategory, isLoading } = useMutation({
        mutationFn: async () => {
            const { data } = await axios.delete(`/api/${params.storeId}/categories/${category.id}`);
            return data;
        },
        onError: (error) => {
            if (error instanceof AxiosError) {
                if (error.response?.status === 405) {
                    toast({
                        title: 'You cannot delete this category',
                        description: 'This category is being used by one or more products',
                        variant: 'destructive'
                    })
                }

                if (error.response?.status === 422) {
                    toast({
                        title: 'Category id not found',
                        description: 'This category does not exist',
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
                description: 'Category removed successfully'
            })
            router.refresh();
            setOpen(false);
        }
    });


    return (
        <div className="relative">
            <DeleteModal
                title='category'
                handleClose={() => setOpen(false)}
                handleDelete={() => deleteCategory()}
                open={open}
                loading={isLoading}
            />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="button">
                        <MoreHorizontal className="w-4 h-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-[128px]">
                    <DropdownMenuItem
                        onClick={() => router.push(`/${params.storeId}/categories/${category.id}`)}
                        className="w-full px-3 cursor-pointer"
                    >
                        Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() => setOpen(true)}
                        className="w-full px-3 cursor-pointer text-red-500 hover:text-red-500"
                    >
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

export default CategoryCell
