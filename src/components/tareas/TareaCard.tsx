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

    // Lógica para deshabilitar el botón
    // Se deshabilita si está en revisión o ya fue aprobado.
    // También se deshabilita si ya fue recibido para evitar múltiples envíos.
    const isUploadDisabled = ['recibido', 'revision', 'aprobado'].includes(tarea.estadoInformacion || '');

    // Mapeo de estilos para los estados
    const getStatusConfig = (status: string | null) => {
        switch (status?.toLowerCase()) {
            case 'aprobado':
                return { label: 'Aprobado', color: 'text-green-600', bg: 'bg-green-50', borderColor: 'border-green-200' };
            case 'rechazado':
                return { label: 'Rechazado', color: 'text-red-600', bg: 'bg-red-50', borderColor: 'border-red-200' };
            case 'recibido':
                return { label: 'Recibido', color: 'text-blue-600', bg: 'bg-blue-50', borderColor: 'border-blue-200' };
            case 'revision':
                return { label: 'En revisión', color: 'text-yellow-600', bg: 'bg-yellow-50', borderColor: 'border-yellow-200' };
            default:
                return { label: 'Pendiente', color: 'text-gray-500', bg: 'bg-gray-50', borderColor: 'border-gray-200' };
        }
    };

    const statusConfig = getStatusConfig(tarea.estadoInformacion);

    return (
        <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            {/* Información de la categoría */}
            <div className="mb-3 pb-3 border-b border-gray-200 flex justify-between items-center">
                <div className="flex items-center gap-2 text-sm">
                    <svg className="h-4 w-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <span className="font-medium text-blue-600">{tarea.categoriaNombre}</span>
                </div>
                
                {/* Badge de estado */}
                <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${statusConfig.bg} ${statusConfig.color} ${statusConfig.borderColor}`}>
                    {statusConfig.label}
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
                                <span className="font-medium text-gray-700">Formato requerido:</span>{' '}
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
                                <span className="font-medium text-gray-700">Observaciones:</span> {tarea.observaciones}
                            </p>
                        )}
                    </div>
                </div>

                {/* Botón de subir archivo con lógica de estado */}
                <div className="flex flex-col items-end gap-2">
                    <FileUploadButton
                        onFileSelect={onFileUpload}
                        acceptedFileTypes={acceptedFileTypes}
                        hasFile={!!tarea.archivoNombre}
                        uploading={uploading}
                        disabled={isUploadDisabled}
                    />
                    
                    {/* Mensaje de ayuda basado en el estado */}
                    {isUploadDisabled && tarea.estadoInformacion === 'aprobado' && (
                        <span className="text-[10px] text-green-600 font-medium">Información aprobada</span>
                    )}
                    {isUploadDisabled && (tarea.estadoInformacion === 'recibido' || tarea.estadoInformacion === 'revision') && (
                        <span className="text-[10px] text-blue-600 font-medium">En espera de revisión</span>
                    )}
                    {tarea.estadoInformacion === 'rechazado' && (
                        <span className="text-[10px] text-red-600 font-medium italic">Por favor, sube el archivo corregido</span>
                    )}
                </div>
            </div>
        </div>
    );
};
