"use client";

import { FC } from "react";
import { Button, buttonVariants } from "./ui/Button";
import { ImagePlus, Trash } from "lucide-react";
import Image from "next/image";
import { CldUploadButton } from 'next-cloudinary';
import { cn } from "@/lib";

interface ImageButtonProps {
    disabled?: boolean;
    value: string[];
    onChange: (url: string) => void;
    onDelete: (url: string) => void;
}

const ImageButton: FC<ImageButtonProps> = ({
    disabled,
    value,
    onChange,
    onDelete
}) => {

    const handleUpload = (result: any) => {
        const image = result?.info?.secure_url;

        if (image) {
            onChange(image);
        }
    };

    return (
        <div className="mb-4 flex flex-col items-start gap-4">
            {value.map((url) => (
                <div key={url} className="relative">
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
                        disabled={disabled}
                        size='button'
                        className="absolute top-2 right-2"
                        onClick={() => onDelete(url)}
                    >
                        <Trash className="w-4 h-4 text-current" />
                    </Button>
                </div>
            ))}
            <CldUploadButton
                options={{ maxFiles: 1 }}
                onUpload={handleUpload}
                uploadPreset='ssqanesp'
            >
                <span className={cn(buttonVariants({ variant: 'secondary' }))}>
                    <ImagePlus className="w-4 h-4 mr-2" />
                    <span>Upload Image</span>
                </span>
            </CldUploadButton>
        </div>
    );
}

export default ImageButton;