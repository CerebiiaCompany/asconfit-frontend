import React, { useRef, useState } from 'react';
import { FolderNavigator } from '../common/FolderNavigator';

interface FileUploadButtonProps {
    onFileSelect: (file: File, customName?: string, carpetaId?: number | null) => void | Promise<unknown>;
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
    // Se pueden elegir varios archivos a la vez; con uno solo se permite renombrarlo
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const selectedFile = selectedFiles.length === 1 ? selectedFiles[0] : null;
    const [customFileName, setCustomFileName] = useState('');
    const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
    const [selectedFolderName, setSelectedFolderName] = useState<string>('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        if (files.length) {
            // Extraer nombre sin extensión (solo se usa si es un único archivo)
            const file = files[0];
            const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
            setSelectedFiles(files);
            setCustomFileName(nameWithoutExt);
            setShowRenameModal(true);
        }
        // Limpiar el input
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    const handleConfirmUpload = async () => {
        if (!selectedFiles.length) return;
        const carpetaId = selectedFolderId || undefined;

        let files = selectedFiles;
        let customName: string | undefined;
        if (selectedFile) {
            // Obtener extensión original y crear archivo con nombre personalizado
            const extension = selectedFile.name.substring(selectedFile.name.lastIndexOf('.'));
            const finalName = customFileName.trim() ? `${customFileName.trim()}${extension}` : selectedFile.name;
            files = [new File([selectedFile], finalName, { type: selectedFile.type })];
            customName = customFileName.trim();
        }

        handleCancelUpload();
        // Uno tras otro, para que el último elegido quede como el más reciente
        for (const f of files) {
            await onFileSelect(f, customName, carpetaId);
        }
    };

    const canConfirm = selectedFile ? !!customFileName.trim() : selectedFiles.length > 0;

    const handleCancelUpload = () => {
        setShowRenameModal(false);
        setSelectedFiles([]);
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
                        multiple
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
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {selectedFile ? 'Subir archivo' : `Subir ${selectedFiles.length} archivos`}
                        </h3>
                        <p className="text-sm text-gray-600 mb-6">
                            {selectedFile
                                ? 'Nombra el archivo y selecciona una carpeta de destino (opcional).'
                                : 'Se subirán con su nombre original. Selecciona una carpeta de destino (opcional).'}
                        </p>
                        {!selectedFile && (
                            <ul className="mb-6 max-h-40 overflow-y-auto border border-gray-200 rounded-lg divide-y divide-gray-100">
                                {selectedFiles.map((f, i) => (
                                    <li key={i} className="px-3 py-1.5 text-sm text-gray-700 truncate" title={f.name}>{f.name}</li>
                                ))}
                            </ul>
                        )}
                        {selectedFile && (
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
                        )}

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
                                disabled={!canConfirm}
                                className={`px-4 py-2 rounded-lg transition-colors ${canConfirm
                                    ? 'bg-orange-500 text-white hover:bg-orange-600'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                            >
                                {selectedFile ? 'Subir archivo' : `Subir ${selectedFiles.length} archivos`}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
