import { useState } from 'react';

interface ConfirmModalState {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText: string;
    onConfirm: (() => void) | null;
}

export const useConfirmModal = () => {
    const [modal, setModal] = useState<ConfirmModalState>({
        isOpen: false,
        title: '',
        message: '',
        confirmText: 'Confirmar',
        onConfirm: null,
    });

    const openConfirm = (title: string, message: string, onConfirm: () => void, confirmText: string = 'Confirmar') => {
        setModal({
            isOpen: true,
            title,
            message,
            confirmText,
            onConfirm,
        });
    };

    const closeConfirm = () => {
        setModal({
            isOpen: false,
            title: '',
            message: '',
            confirmText: 'Confirmar',
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
        confirmText: modal.confirmText,
        openConfirm,
        closeConfirm,
        handleConfirm,
    };
};
