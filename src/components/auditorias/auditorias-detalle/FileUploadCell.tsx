import React from 'react';

interface FileUploadCellProps {
    subtareaId: number;
    archivoNombre?: string;
    formatoArchivo: string;
    isUploading: boolean;
    fileInputRef: (el: HTMLInputElement | null) => void;
    onFileSelect: (subtareaId: number) => void;
    onFileChange: (event: React.ChangeEvent<HTMLInputElement>, subtareaId: number) => void;
    onOpenFile: (subtareaId: number, fileName: string) => void;
    getAcceptedFileTypes: (formatoArchivo: string) => string;
}

export const FileUploadCell: React.FC<FileUploadCellProps> = ({
    subtareaId,
    archivoNombre,
    formatoArchivo,
    isUploading,
    fileInputRef,
    onFileSelect,
    onFileChange,
    onOpenFile,
    getAcceptedFileTypes
}) => {
    return (
        <div className="flex items-center gap-2">
            {archivoNombre ? (
                <button
                    onClick={() => onOpenFile(subtareaId, archivoNombre)}
                    className="flex items-center gap-1 hover:bg-blue-50 px-2 py-1 rounded transition-colors group"
                    title="Click para abrir en nueva pestaña"
                >
                    <svg className="h-4 w-4 text-blue-500 group-hover:text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span className="text-xs text-blue-600 group-hover:text-blue-700 underline truncate" title={archivoNombre}>
                        {archivoNombre.length > 15
                            ? archivoNombre.substring(0, 15) + '...'
                            : archivoNombre}
                    </span>
                </button>
            ) : (
                <div className="flex items-center gap-1 text-gray-400">

                    <span className="text-xs">Sin archivo</span>
                </div>
            )}
            <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => onFileChange(e, subtareaId)}
                accept={getAcceptedFileTypes(formatoArchivo)}
                data-formato={formatoArchivo}
                className="hidden"
            />
            <button
                onClick={() => onFileSelect(subtareaId)}
                disabled={isUploading}
                className="p-1 text-orange-600 hover:bg-orange-50 rounded transition-colors disabled:opacity-50"
                title="Subir archivo"
            >
                {isUploading ? (
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                ) : (
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                )}
            </button>
        </div>
    );
};
