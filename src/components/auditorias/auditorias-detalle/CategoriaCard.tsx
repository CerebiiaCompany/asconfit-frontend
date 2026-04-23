import React from 'react';
import { SubtareaTable } from './SubtareaTable';

interface CategoriaCardProps {
    categoria: any;
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
}

export const CategoriaCard: React.FC<CategoriaCardProps> = ({
    categoria,
    auditoria,
    uploadingSubtareaId,
    fileInputRefs,
    onFileSelect,
    onFileChange,
    onOpenFile,
    getAcceptedFileTypes,
    onEstadoChange,
    updatingEstadoSubtareaId,
    userRole
}) => {
    return (
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4 flex justify-between items-center">
                <h4 className="text-xl font-bold text-white">{categoria.nombre}</h4>
                {categoria.delegado && (
                    <div className="flex items-center text-white bg-white/20 px-3 py-1 rounded-full text-sm">
                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Delegado: <span className="font-semibold ml-1.5">{categoria.delegado.name}</span>
                    </div>
                )}
            </div>

            <div className="px-6 py-4">
                {categoria.subtareas && categoria.subtareas.length > 0 ? (
                    <SubtareaTable
                        subtareas={categoria.subtareas}
                        auditoria={auditoria}
                        uploadingSubtareaId={uploadingSubtareaId}
                        fileInputRefs={fileInputRefs}
                        onFileSelect={onFileSelect}
                        onFileChange={onFileChange}
                        onOpenFile={onOpenFile}
                        getAcceptedFileTypes={getAcceptedFileTypes}
                        onEstadoChange={onEstadoChange}
                        updatingEstadoSubtareaId={updatingEstadoSubtareaId}
                        userRole={userRole}
                    />
                ) : (
                    <p className="text-center text-gray-500 py-8">
                        No hay requerimientos en esta categoría
                    </p>
                )}
            </div>
        </div>
    );
};
