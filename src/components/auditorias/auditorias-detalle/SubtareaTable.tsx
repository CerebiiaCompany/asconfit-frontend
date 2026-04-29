import React from 'react';
import { SubtareaRow } from './SubtareaRow';

interface SubtareaTableProps {
    subtareas: any[];
    auditoria: any;
    uploadingSubtareaId: number | null;
    fileInputRefs: React.MutableRefObject<{ [key: number]: HTMLInputElement | null }>;
    onFileSelect: (subtareaId: number) => void;
    onFileChange: (event: React.ChangeEvent<HTMLInputElement>, subtareaId: number) => void;
    onOpenFile: (subtareaId: number, fileName: string) => void;
    getAcceptedFileTypes: (formatoArchivo: string) => string;
    onEstadoChange: (subtareaId: number, estado: string) => void;
    updatingEstadoSubtareaId: number | null;
    userRole: string;
    findingsCount?: Record<number, number>;
    onFindingCreated?: (actividadId: number, count: number) => void;
}

export const SubtareaTable: React.FC<SubtareaTableProps> = ({
    subtareas,
    auditoria,
    uploadingSubtareaId,
    fileInputRefs,
    onFileSelect,
    onFileChange,
    onOpenFile,
    getAcceptedFileTypes,
    onEstadoChange,
    updatingEstadoSubtareaId,
    userRole,
    findingsCount = {},
    onFindingCreated,
}) => {
    return (
        <div className="overflow-hidden">
            <table className="w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500  tracking-wider w-1/4">
                            Requerimiento
                        </th>
                        <th className="px-2 py-3 text-left text-xs font-medium text-gray-500  tracking-wider w-20">
                            Prioridad
                        </th>
                        <th className="px-2 py-3 text-left text-xs font-medium text-gray-500  tracking-wider w-24">
                            Fecha Solicitud
                        </th>
                        <th className="px-2 py-3 text-left text-xs font-medium text-gray-500  tracking-wider w-24">
                            Fecha de entrega
                        </th>
                        <th className="px-2 py-3 text-left text-xs font-medium text-gray-500  tracking-wider w-24">
                            Estado
                        </th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500  tracking-wider">
                            Archivo
                        </th>
                        <th className="px-2 py-3 text-left text-xs font-medium text-gray-500  tracking-wider w-20">
                            Formato
                        </th>
                        <th className="px-2 py-3 text-left text-xs font-medium text-gray-500  tracking-wider w-24">
                            Hallazgo
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {subtareas.map((subtarea) => (
                        <SubtareaRow
                            key={subtarea.id}
                            subtarea={subtarea}
                            auditoria={auditoria}
                            isUploading={uploadingSubtareaId === subtarea.id}
                            fileInputRef={(el) => { fileInputRefs.current[subtarea.id] = el; }}
                            onFileSelect={onFileSelect}
                            onFileChange={onFileChange}
                            onOpenFile={onOpenFile}
                            getAcceptedFileTypes={getAcceptedFileTypes}
                            onEstadoChange={onEstadoChange}
                            isUpdatingEstado={updatingEstadoSubtareaId === subtarea.id}
                            userRole={userRole}
                            findingsCount={findingsCount[subtarea.id] || 0}
                            onFindingCreated={onFindingCreated}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
};
