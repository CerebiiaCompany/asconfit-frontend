import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { FolderNavigator } from '../../common/FolderNavigator';

interface FileUploadCellProps {
    subtareaId: number;
    archivoNombre?: string;
    formatoArchivo: string;
    empresaId?: number;
    isUploading: boolean;
    fileInputRef: (el: HTMLInputElement | null) => void;
    onFileSelect: (subtareaId: number) => void;
    onUploadConfirm: (subtareaId: number, file: File, carpetaId?: number | null) => void;
    onOpenFile: (subtareaId: number, fileName: string) => void;
    getAcceptedFileTypes: (formatoArchivo: string) => string;
}

export const FileUploadCell: React.FC<FileUploadCellProps> = ({
    subtareaId,
    archivoNombre,
    formatoArchivo,
    empresaId,
    isUploading,
    fileInputRef,
    onFileSelect,
    onUploadConfirm,
    onOpenFile,
    getAcceptedFileTypes
}) => {
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [customFileName, setCustomFileName] = useState('');
    const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
    const [selectedFolderName, setSelectedFolderName] = useState<string>('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
            setSelectedFile(file);
            setCustomFileName(nameWithoutExt);
            setShowUploadModal(true);
        }
        e.target.value = '';
    };

    const resetModalState = () => {
        setShowUploadModal(false);
        setSelectedFile(null);
        setCustomFileName('');
        setSelectedFolderId(null);
        setSelectedFolderName('');
    };

    const handleConfirmUpload = () => {
        if (!selectedFile) return;

        const extension = selectedFile.name.substring(selectedFile.name.lastIndexOf('.'));
        const finalName = customFileName.trim() ? `${customFileName.trim()}${extension}` : selectedFile.name;
        const renamedFile = new File([selectedFile], finalName, { type: selectedFile.type });

        onUploadConfirm(subtareaId, renamedFile, selectedFolderId || undefined);
        resetModalState();
    };

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

                    <span className="text-xs">Sin adjunto</span>
                </div>
            )}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
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

            {showUploadModal && createPortal(
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Subir archivo
                        </h3>
                        <p className="text-sm text-gray-600 mb-6">
                            Nombra el archivo y selecciona una carpeta de destino (opcional).
                        </p>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nombre del archivo
                            </label>
                            <input
                                type="text"
                                value={customFileName}
                                onChange={(e) => setCustomFileName(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                placeholder="Ej: Certificado de Retención - Abril 2026"
                                autoFocus
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleConfirmUpload();
                                    if (e.key === 'Escape') resetModalState();
                                }}
                            />
                            {selectedFile && (
                                <p className="text-xs text-gray-500 mt-2">
                                    Extensión: {selectedFile.name.substring(selectedFile.name.lastIndexOf('.'))}
                                </p>
                            )}
                        </div>

                        {/* Selector de carpetas */}
                        <div className="mb-6">
                            <h4 className="text-sm font-semibold text-gray-900 mb-3">
                                Carpeta de destino (opcional)
                            </h4>
                            <p className="text-xs text-gray-500 mb-3">
                                Si no seleccionas una carpeta, el archivo se guardará en la auditoría.
                            </p>
                            {empresaId ? (
                                <FolderNavigator
                                    empresaId={empresaId}
                                    onFolderSelect={(carpetaId, carpetaNombre) => {
                                        setSelectedFolderId(carpetaId);
                                        setSelectedFolderName(carpetaNombre);
                                    }}
                                    selectedFolderId={selectedFolderId}
                                />
                            ) : (
                                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <p className="text-sm text-yellow-700">
                                        No se pudo cargar el selector de carpetas.
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={resetModalState}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleConfirmUpload}
                                disabled={!customFileName.trim()}
                                className={`px-4 py-2 rounded-lg transition-colors ${customFileName.trim()
                                    ? 'bg-orange-500 text-white hover:bg-orange-600'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                            >
                                Subir archivo
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};
