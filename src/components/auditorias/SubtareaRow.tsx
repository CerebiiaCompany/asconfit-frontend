import React from 'react';
import { PriorityBadge } from './PriorityBadge';
import { EstadoInformacionBadge } from './EstadoInformacionBadge';
import { FileUploadCell } from './FileUploadCell';
import { FormatoBadge } from './FormatoBadge';

interface SubtareaRowProps {
    subtarea: any;
    isUploading: boolean;
    fileInputRef: (el: HTMLInputElement | null) => void;
    onFileSelect: (subtareaId: number) => void;
    onFileChange: (event: React.ChangeEvent<HTMLInputElement>, subtareaId: number) => void;
    onOpenFile: (subtareaId: number, fileName: string) => void;
    getAcceptedFileTypes: (formatoArchivo: string) => string;
    onEstadoChange: (subtareaId: number, estado: string) => void;
    isUpdatingEstado: boolean;
    userRole: string;
}

export const SubtareaRow: React.FC<SubtareaRowProps> = ({
    subtarea,
    isUploading,
    fileInputRef,
    onFileSelect,
    onFileChange,
    onOpenFile,
    getAcceptedFileTypes,
    onEstadoChange,
    isUpdatingEstado,
    userRole
}) => {
    const handleEstadoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onEstadoChange(subtarea.id, e.target.value);
    };
    return (
        <tr className="hover:bg-gray-50">
            <td className="px-3 py-3">
                <div className="text-sm text-gray-900 font-medium break-words">
                    {subtarea.nombre}
                </div>
                {subtarea.observaciones && (
                    <div className="text-xs text-gray-500 mt-1 break-words">
                        {subtarea.observaciones}
                    </div>
                )}
            </td>
            <td className="px-2 py-3 whitespace-nowrap">
                <PriorityBadge prioridad={subtarea.prioridad} />
            </td>
            <td className="px-2 py-3 whitespace-nowrap text-xs text-gray-900">
                {subtarea.fecha_solicitud || '-'}
            </td>
            <td className="px-2 py-3 whitespace-nowrap text-xs text-gray-900">
                {subtarea.tiempo_entrega || '-'}
            </td>
            <td className="px-2 py-3 whitespace-nowrap">
                {userRole === 'auditor' ? (
                    <select
                        value={subtarea.estado_informacion}
                        onChange={handleEstadoChange}
                        disabled={isUpdatingEstado}
                        className="text-xs px-2 py-1 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <option value="pendiente">Pendiente</option>
                        <option value="recibido">Recibido</option>
                        <option value="revision">En Revisión</option>
                        <option value="aprobado">Aprobado</option>
                    </select>
                ) : (
                    <EstadoInformacionBadge estado={subtarea.estado_informacion} />
                )}
            </td>
            <td className="px-3 py-3">
                <FileUploadCell
                    subtareaId={subtarea.id}
                    archivoNombre={subtarea.archivo_nombre}
                    formatoArchivo={subtarea.formato_archivo}
                    isUploading={isUploading}
                    fileInputRef={fileInputRef}
                    onFileSelect={onFileSelect}
                    onFileChange={onFileChange}
                    onOpenFile={onOpenFile}
                    getAcceptedFileTypes={getAcceptedFileTypes}
                />
            </td>
            <td className="px-2 py-3 whitespace-nowrap">
                <FormatoBadge formato={subtarea.formato_archivo} />
            </td>
        </tr>
    );
};
