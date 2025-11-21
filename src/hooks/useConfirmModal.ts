import { useState } from 'react';

interface ConfirmModalState {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: (() => void) | null;
}

export const useConfirmModal = () => {
    const [modal, setModal] = useState<ConfirmModalState>({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: null,
    });

    const openConfirm = (title: string, message: string, onConfirm: () => void) => {
        setModal({
            isOpen: true,
            title,
            message,
            onConfirm,
        });
    };

    const closeConfirm = () => {
        setModal({
            isOpen: false,
            title: '',
            message: '',
            onConfirm: null,
        });
    };

    const handleConfirm = () => {
        if (modal.onConfirm) {
            modal.onConfirm();
        }
        closeConfirm();
    };

    return {
        isOpen: modal.isOpen,
        title: modal.title,
        message: modal.message,
        openConfirm,
        closeConfirm,
        handleConfirm,
    };
};
