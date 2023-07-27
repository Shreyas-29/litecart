"use client";

import { toast } from "@/components/hooks/use-toast";
import axios, { AxiosError } from "axios";
import { MoreHorizontal } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { FC, useState } from "react";

import { DeleteModal } from "@/components";
import { Button } from "@/components/ui/Button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/DropDownMenu";
import { useMutation } from "@tanstack/react-query";
import { ColorColumn } from "./ColorColumn";

interface ColorCellProps {
    color: ColorColumn;
}

const ColorCell: FC<ColorCellProps> = ({
    color
}) => {

    const params = useParams();

    const router = useRouter();

    const [open, setOpen] = useState(false);

    const { mutate: deleteColor, isLoading } = useMutation({
        mutationFn: async () => {
            const { data } = await axios.delete(`/api/${params.storeId}/colors/${color.id}`);
            return data;
        },
        onError: (error) => {
            if (error instanceof AxiosError) {
                if (error.response?.status === 405) {
                    return toast({
                        title: 'You cannot delete this color',
                        description: 'This color is being used by one or more products.',
                        variant: 'destructive'
                    })
                }

                if (error.response?.status === 422) {
                    return toast({
                        title: 'Color id not found',
                        description: 'This color does not exist, please try again.',
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
                description: 'Color removed successfully'
            })
            router.refresh();
            setOpen(false);
        }
    });


    return (
        <div className="relative">
            <DeleteModal
                title='color'
                handleClose={() => setOpen(false)}
                handleDelete={() => deleteColor()}
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
                        onClick={() => router.push(`/${params.storeId}/colors/${color.id}`)}
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

export default ColorCell
