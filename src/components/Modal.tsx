"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/components/ui/Dialog";
import { FC } from "react";

interface ModalProps {
    title: string;
    description: string;
    open: boolean;
    handleClose: () => void;
    children: React.ReactNode;
}

const Modal: FC<ModalProps> = ({
    title,
    description,
    open,
    handleClose,
    children
}) => {


    const handleOpenChange = (open: boolean) => {
        if (!open) {
            handleClose();
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="py-6">
                <DialogHeader className="space-y-2.5">
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        {description}
                    </DialogDescription>
                </DialogHeader>
                <div>
                    {children}
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default Modal;