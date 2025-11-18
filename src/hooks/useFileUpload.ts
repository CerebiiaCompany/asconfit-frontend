import { useState, useRef } from 'react';
import { auditoriaService } from '../services/auditoriaService';

interface UseFileUploadProps {
    onSuccess?: () => void;
    onError?: (message: string) => void;
}

export const useFileUpload = ({ onSuccess, onError }: UseFileUploadProps = {}) => {
    const [uploadingSubtareaId, setUploadingSubtareaId] = useState<number | null>(null);
    const fileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});

    const getAcceptedFileTypes = (formatoArchivo: string): string => {
        const formatos: Record<string, string> = {
            'pdf': '.pdf',
            'excel': '.xlsx,.xls,.csv,.xlsm,.xlsb,.xltx,.xltm',
            'word': '.doc,.docx,.docm,.dotx,.dotm,.odt'
        };
        return formatos[formatoArchivo] || '*';
    };

    const handleFileSelect = (subtareaId: number) => {
        fileInputRefs.current[subtareaId]?.click();
    };

    const handleFileChange = async (
        event: React.ChangeEvent<HTMLInputElement>,
        subtareaId: number
    ) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            setUploadingSubtareaId(subtareaId);
            await auditoriaService.uploadFile(subtareaId, file);
            onSuccess?.();
        } catch (error: any) {
            console.error('Error al subir archivo:', error);
            onError?.(error.response?.data?.message || 'Error al subir el archivo');
        } finally {
            setUploadingSubtareaId(null);
            if (event.target) {
                event.target.value = '';
            }
        }
    };

    const handleOpenFile = async (subtareaId: number, fileName: string) => {
        try {
            const response = await auditoriaService.downloadFile(subtareaId);
            const blob = new Blob([response.data], { type: response.headers['content-type'] });
            const url = window.URL.createObjectURL(blob);
            window.open(url, '_blank');
            setTimeout(() => window.URL.revokeObjectURL(url), 100);
        } catch (error) {
            console.error('Error al abrir archivo:', error);
            onError?.('Error al abrir el archivo');
        }
    };

    return {
        uploadingSubtareaId,
        fileInputRefs,
        getAcceptedFileTypes,
        handleFileSelect,
        handleFileChange,
        handleOpenFile
    };
};
