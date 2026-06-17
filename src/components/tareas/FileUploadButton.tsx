import React, { useRef, useState } from 'react';
import { FolderNavigator } from '../common/FolderNavigator';

interface FileUploadButtonProps {
    onFileSelect: (file: File, customName?: string, carpetaId?: number | null) => void;
    acceptedFileTypes: string;
    hasFile: boolean;
    uploading?: boolean;
    disabled?: boolean;
    empresaId?: number;
}

export const FileUploadButton: React.FC<FileUploadButtonProps> = ({
    onFileSelect,
    acceptedFileTypes,
    hasFile,
    uploading = false,
    disabled = false,
    empresaId
}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [showRenameModal, setShowRenameModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [customFileName, setCustomFileName] = useState('');
    const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
    const [selectedFolderName, setSelectedFolderName] = useState<string>('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Extraer nombre sin extensión
            const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
            setSelectedFile(file);
            setCustomFileName(nameWithoutExt);
            setShowRenameModal(true);
        }
        // Limpiar el input
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    const handleConfirmUpload = () => {
        if (selectedFile) {
            // Obtener extensión original
            const extension = selectedFile.name.substring(selectedFile.name.lastIndexOf('.'));
            const finalName = customFileName.trim() ? `${customFileName.trim()}${extension}` : selectedFile.name;

            // Crear nuevo archivo con nombre personalizado
            const renamedFile = new File([selectedFile], finalName, { type: selectedFile.type });

            onFileSelect(renamedFile, customFileName.trim(), selectedFolderId || undefined);
            setShowRenameModal(false);
            setSelectedFile(null);
            setCustomFileName('');
            setSelectedFolderId(null);
            setSelectedFolderName('');
        }
    };

    const handleCancelUpload = () => {
        setShowRenameModal(false);
        setSelectedFile(null);
        setCustomFileName('');
        setSelectedFolderId(null);
        setSelectedFolderName('');
    };

    return (
        <>
            <div className="flex flex-col gap-2 items-end">
                <label className={uploading || disabled ? 'cursor-not-allowed' : 'cursor-pointer'}>
                    <input
                        ref={inputRef}
                        type="file"
                        className="hidden"
                        accept={acceptedFileTypes}
                        onChange={handleFileChange}
                        disabled={uploading || disabled}
                    />
                    <div className={`px-4 py-2 text-white text-sm font-semibold rounded-lg transition-colors text-center whitespace-nowrap flex items-center gap-2 ${uploading || disabled
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
            </div>

            {/* Modal de renombrado */}
            {showRenameModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Nombrar archivo
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Dale un nombre descriptivo al archivo para identificarlo fácilmente.
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
                                    if (e.key === 'Escape') handleCancelUpload();
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
                                Seleccionar carpeta de destino
                            </h4>
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
                                        <strong>Debug:</strong> No se puede cargar el selector de carpetas.
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        empresaId: {empresaId || 'undefined'}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={handleCancelUpload}
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
                </div>
            )}
        </>
    );
};
