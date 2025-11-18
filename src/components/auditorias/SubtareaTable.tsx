import React from 'react';
import { SubtareaRow } from './SubtareaRow';

interface SubtareaTableProps {
    subtareas: any[];
    uploadingSubtareaId: number | null;
    fileInputRefs: React.MutableRefObject<{ [key: number]: HTMLInputElement | null }>;
    onFileSelect: (subtareaId: number) => void;
    onFileChange: (event: React.ChangeEvent<HTMLInputElement>, subtareaId: number) => void;
    onOpenFile: (subtareaId: number, fileName: string) => void;
    getAcceptedFileTypes: (formatoArchivo: string) => string;
}

export const SubtareaTable: React.FC<SubtareaTableProps> = ({
    subtareas,
    uploadingSubtareaId,
    fileInputRefs,
    onFileSelect,
    onFileChange,
    onOpenFile,
    getAcceptedFileTypes
}) => {
    return (
        <div className="overflow-hidden">
            <table className="w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                            Requerimiento
                        </th>
                        <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                            Prioridad
                        </th>
                        <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                            F. Solicitud
                        </th>
                        <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                            T. Entrega
                        </th>
                        <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                            Estado
                        </th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Archivo
                        </th>
                        <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                            Formato
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {subtareas.map((subtarea) => (
                        <SubtareaRow
                            key={subtarea.id}
                            subtarea={subtarea}
                            isUploading={uploadingSubtareaId === subtarea.id}
                            fileInputRef={(el) => { fileInputRefs.current[subtarea.id] = el; }}
                            onFileSelect={onFileSelect}
                            onFileChange={onFileChange}
                            onOpenFile={onOpenFile}
                            getAcceptedFileTypes={getAcceptedFileTypes}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
};
