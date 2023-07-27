"use client";

import React, { FC, useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader } from './ui/Dialog';
import Modal from './Modal';
import { Button } from './ui/Button';


interface DeleteModalProps {
    title: string;
    open: boolean;
    loading: boolean;
    handleDelete: () => void;
    handleClose: () => void;
}


const DeleteModal: FC<DeleteModalProps> = ({
    open,
    loading,
    handleDelete,
    handleClose,
    title
}) => {

    return (
        <Modal
            title={`Are you sure want to delete the ${title}?`}
            description='This action cannot be undone.'
            open={open}
            handleClose={handleClose}>
            <div className='pt-6 space-x-4 flex items-center justify-end w-full'>
                <Button
                    type='button'
                    variant='outline'
                    onClick={handleClose}
                >
                    Cancel
                </Button>
                <Button
                    type='submit'
                    variant='destructive'
                    isLoading={loading}
                    onClick={handleDelete}
                >
                    Continue
                </Button>
            </div>
        </Modal>
    )
}

export default DeleteModal
