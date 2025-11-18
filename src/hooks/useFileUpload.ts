import { useState, useRef } from 'react';
import { auditoriaService } from '../services/auditoriaService';

interface UseFileUploadOptions {
    onSuccess?: (fileName: string) => void;
    onError?: (message: string) => void;
}

export const useFileUpload = (options?: UseFileUploadOptions) => {
    const [uploading, setUploading] = useState(false);
    const [uploadingSubtareaId, setUploadingSubtareaId] = useState<number | null>(null);
    const fileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});

    const getAcceptedFileTypes = (formatoArchivo: string | null): string => {
        if (!formatoArchivo) return '*';

        const formatos: Record<string, string> = {
            'pdf': '.pdf',
            'excel': '.xlsx,.xls,.csv,.xlsm,.xlsb,.xltx,.xltm',
            'word': '.doc,.docx,.docm,.dotx,.dotm,.odt'
        };
        return formatos[formatoArchivo.toLowerCase()] || '*';
    };

    const getExtensionesPermitidas = (formatoArchivo: string | null): string[] => {
        if (!formatoArchivo) return [];

        const extensiones: Record<string, string[]> = {
            'pdf': ['pdf'],
            'excel': ['xlsx', 'xls', 'csv', 'xlsm', 'xlsb', 'xltx', 'xltm'],
            'word': ['doc', 'docx', 'docm', 'dotx', 'dotm', 'odt']
        };
        return extensiones[formatoArchivo.toLowerCase()] || [];
    };

    const validateFile = (file: File, formatoArchivo: string | null): { valid: boolean; error?: string } => {
        if (!formatoArchivo) return { valid: true };

        const extension = file.name.split('.').pop()?.toLowerCase();
        const formatosPermitidos = getExtensionesPermitidas(formatoArchivo);

        if (extension && formatosPermitidos.length > 0 && !formatosPermitidos.includes(extension)) {
            return {
                valid: false,
                error: `El archivo debe ser de tipo: ${formatosPermitidos.join(', ')}`
            };
        }

        return { valid: true };
    };

    const uploadFile = async (subtareaId: number, file: File, formatoArchivo: string | null) => {
        const validation = validateFile(file, formatoArchivo);

        if (!validation.valid) {
            options?.onError?.(validation.error!);
            return { success: false, error: validation.error };
        }

        try {
            setUploading(true);
            setUploadingSubtareaId(subtareaId);
            await auditoriaService.uploadFile(subtareaId, file);
            options?.onSuccess?.(file.name);
            return { success: true };
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'No se pudo subir el archivo';
            options?.onError?.(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setUploading(false);
            setUploadingSubtareaId(null);
        }
    };

    const handleFileSelect = (subtareaId: number) => {
        fileInputRefs.current[subtareaId]?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>, subtareaId: number) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Obtener el formato desde el input accept attribute o desde el data attribute
        const formatoArchivo = event.target.getAttribute('data-formato') || null;
        await uploadFile(subtareaId, file, formatoArchivo);
    };

    const handleOpenFile = (subtareaId: number, fileName: string) => {
        // Construir la URL del archivo - ajustar según tu backend
        const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';
        const fileUrl = `${baseUrl}/api/archivos/${subtareaId}/${fileName}`;
        window.open(fileUrl, '_blank');
    };

    return {
        uploadFile,
        uploading,
        uploadingSubtareaId,
        fileInputRefs,
        getAcceptedFileTypes,
        getExtensionesPermitidas,
        handleFileSelect,
        handleFileChange,
        handleOpenFile
    };
};
