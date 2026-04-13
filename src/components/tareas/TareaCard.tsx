import React from 'react';
import { TareaFlat } from '../../hooks/useTareas';
import { FileUploadButton } from './FileUploadButton';

interface TareaCardProps {
    tarea: TareaFlat;
    onFileUpload: (file: File) => void;
    acceptedFileTypes: string;
    uploading?: boolean;
}

export const TareaCard: React.FC<TareaCardProps> = ({
    tarea,
    onFileUpload,
    acceptedFileTypes,
    uploading = false
}) => {
    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return null;
        const parts = dateStr.split('T')[0].split('-');
        if (parts.length === 3) {
            return `${parts[2]}/${parts[1]}/${parts[0]}`;
        }
        return dateStr;
    };

    return (
        <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            {/* Información de la categoría */}
            <div className="mb-3 pb-3 border-b border-gray-200">
                <div className="flex items-center gap-2 text-sm">
                    <svg className="h-4 w-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <span className="font-medium text-blue-600">{tarea.categoriaNombre}</span>
                </div>
            </div>

            {/* Información de la subtarea */}
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                    <h4 className="font-medium text-gray-800 mb-2">
                        {tarea.subtareaNombre}
                    </h4>
                    <div className="space-y-1">
                        {tarea.formatoArchivo && (
                            <p className="text-sm text-gray-600">
                                <span className="font-medium">Formato requerido:</span>{' '}
                                <span className="text-orange-600 font-semibold">{tarea.formatoArchivo}</span>
                            </p>
                        )}
                        <div className="flex flex-wrap gap-x-6 gap-y-1">
                            {tarea.fechaSolicitud && (
                                <p className="text-sm text-gray-600">
                                    <span className="font-medium text-gray-700">Solicitud:</span> {formatDate(tarea.fechaSolicitud)}
                                </p>
                            )}
                            {tarea.fechaEntrega && (
                                <p className="text-sm text-gray-600">
                                    <span className="font-medium text-gray-700">Entrega:</span> {formatDate(tarea.fechaEntrega)}
                                </p>
                            )}
                        </div>
                        {tarea.observaciones && (
                            <p className="text-sm text-gray-600">
                                <span className="font-medium">Observaciones:</span> {tarea.observaciones}
                            </p>
                        )}
                    </div>
                </div>

                {/* Botón de subir archivo */}
                <FileUploadButton
                    onFileSelect={onFileUpload}
                    acceptedFileTypes={acceptedFileTypes}
                    hasFile={!!tarea.archivoNombre}
                    uploading={uploading}
                />
            </div>
        </div>
    );
};
