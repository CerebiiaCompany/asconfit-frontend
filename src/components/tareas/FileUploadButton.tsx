import React, { useRef } from 'react';

interface FileUploadButtonProps {
    onFileSelect: (file: File) => void;
    acceptedFileTypes: string;
    hasFile: boolean;
    uploading?: boolean;
    disabled?: boolean;
}

export const FileUploadButton: React.FC<FileUploadButtonProps> = ({
    onFileSelect,
    acceptedFileTypes,
    hasFile,
    uploading = false,
    disabled = false
}) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onFileSelect(file);
        }
        // Limpiar el input para permitir subir el mismo archivo de nuevo
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    return (
        <div className="flex flex-col gap-2 items-end">
            <label className="cursor-pointer">
                <input
                    ref={inputRef}
                    type="file"
                    className="hidden"
                    accept={acceptedFileTypes}
                    onChange={handleFileChange}
                    disabled={uploading}
                />
                <div className={`px-4 py-2 text-white text-sm font-semibold rounded-lg transition-colors text-center whitespace-nowrap flex items-center gap-2 ${
                    uploading || disabled
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-orange-500 hover:bg-orange-600'
                }`}>
                    {uploading ? (
                        <>
                            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Subiendo...
                        </>
                    ) : (
                        <>
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            Subir archivo
                        </>
                    )}
                </div>
            </label>

            {/* El estado ahora se maneja en el componente padre TareaCard */}
        </div>
    );
};
