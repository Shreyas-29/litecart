"use client";

import axios, { AxiosError } from "axios";
import { FC, useState } from "react";
import { Copy, Delete, Edit, MoreHorizontal, Trash } from "lucide-react";
import { toast } from "@/components/hooks/use-toast";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/DropDownMenu";
import { DeleteModal } from "@/components";
import { ProductColumn } from "./ProductColumn";
import { useMutation } from "@tanstack/react-query";

interface ProductCellProps {
    product: ProductColumn;
}

const ProductCell: FC<ProductCellProps> = ({
    product
}) => {

    const params = useParams();

    const router = useRouter();

    const [open, setOpen] = useState(false);

    const { mutate: deleteColor, isLoading } = useMutation({
        mutationFn: async () => {
            const { data } = await axios.delete(`/api/${params.storeId}/products/${product.id}`);
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
                description: 'Product removed successfully'
            })
            router.refresh();
            setOpen(false);
        }
    });

    const updateProduct = async () => {
        return toast({
            title: 'Coming soon!',
            description: 'This feature is not available yet.',
        });
    }


    return (
        <div className="relative">
            <DeleteModal
                title="product"
                open={open}
                loading={isLoading}
                handleDelete={() => deleteColor()}
                handleClose={() => setOpen(false)}
            />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="button">
                        <MoreHorizontal className="w-4 h-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-[128px]">
                    <DropdownMenuItem
                        onClick={updateProduct}
                        // onClick={() => router.push(`/${params.storeId}/products/${product.id}`)}
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

export default ProductCell
