import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { FolderNavigator } from '../../common/FolderNavigator';
import { SubtareaArchivosModal } from '../SubtareaArchivosModal';

interface FileUploadCellProps {
    subtareaId: number;
    archivoNombre?: string;
    formatoArchivo: string;
    empresaId?: number;
    isUploading: boolean;
    fileInputRef: (el: HTMLInputElement | null) => void;
    onFileSelect: (subtareaId: number) => void;
    onUploadConfirm: (subtareaId: number, file: File, carpetaId?: number | null) => void | Promise<unknown>;
    onOpenFile: (subtareaId: number, fileName: string) => void;
    getAcceptedFileTypes: (formatoArchivo: string) => string;
    /** Cantidad de archivos de la tarea (puede tener varios). */
    archivosCount?: number;
    subtareaNombre?: string;
    /** Se llama al eliminar un archivo desde la lista. */
    onArchivosChanged?: () => void;
    auditoriaCreadorId?: number | null;
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
    getAcceptedFileTypes,
    archivosCount = 0,
    subtareaNombre,
    onArchivosChanged,
    auditoriaCreadorId,
}) => {
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showArchivos, setShowArchivos] = useState(false);
    // Se pueden elegir varios archivos a la vez; con uno solo se permite renombrarlo
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const selectedFile = selectedFiles.length === 1 ? selectedFiles[0] : null;
    const [customFileName, setCustomFileName] = useState('');
    const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
    const [selectedFolderName, setSelectedFolderName] = useState<string>('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        if (files.length) {
            const first = files[0];
            setSelectedFiles(files);
            setCustomFileName(first.name.substring(0, first.name.lastIndexOf('.')) || first.name);
            setShowUploadModal(true);
        }
        e.target.value = '';
    };

    const resetModalState = () => {
        setShowUploadModal(false);
        setSelectedFiles([]);
        setCustomFileName('');
        setSelectedFolderId(null);
        setSelectedFolderName('');
    };

    const handleConfirmUpload = async () => {
        if (!selectedFiles.length) return;
        const carpetaId = selectedFolderId || undefined;

        let files = selectedFiles;
        if (selectedFile) {
            const extension = selectedFile.name.substring(selectedFile.name.lastIndexOf('.'));
            const finalName = customFileName.trim() ? `${customFileName.trim()}${extension}` : selectedFile.name;
            files = [new File([selectedFile], finalName, { type: selectedFile.type })];
        }

        resetModalState();
        // Uno tras otro, para que el último elegido quede como el más reciente
        for (const f of files) {
            await onUploadConfirm(subtareaId, f, carpetaId);
        }
    };

    const canConfirm = selectedFile ? !!customFileName.trim() : selectedFiles.length > 0;

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
            {archivosCount > 1 && (
                <button
                    onClick={() => setShowArchivos(true)}
                    className="text-[11px] font-semibold text-orange-600 bg-orange-50 hover:bg-orange-100 px-1.5 py-0.5 rounded whitespace-nowrap"
                    title="Ver todos los archivos de la tarea"
                >
                    {archivosCount} archivos
                </button>
            )}
            {archivosCount === 1 && (
                <button
                    onClick={() => setShowArchivos(true)}
                    className="text-[11px] text-gray-400 hover:text-orange-600 px-1 whitespace-nowrap"
                    title="Ver o eliminar el archivo"
                >
                    Gestionar
                </button>
            )}
            <input
                type="file"
                multiple
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
                title="Subir archivo(s)"
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
                                    if (e.key === 'Escape') resetModalState();
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
                </div>,
                document.body
            )}

            {showArchivos && (
                <SubtareaArchivosModal
                    subtareaId={subtareaId}
                    subtareaNombre={subtareaNombre}
                    auditoriaCreadorId={auditoriaCreadorId}
                    onClose={() => setShowArchivos(false)}
                    onChanged={onArchivosChanged}
                />
            )}
        </div>
    );
};
