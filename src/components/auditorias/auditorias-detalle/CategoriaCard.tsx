import React, { useState } from 'react';
import { SubtareaTable } from './SubtareaTable';
import { UserProfileModal } from '../../Users/UserProfileModal';

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
    findingsCount?: Record<number, number>;
    onFindingCreated?: (actividadId: number, count: number) => void;
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
    userRole,
    findingsCount = {},
    onFindingCreated,
}) => {
    const [showProfileModal, setShowProfileModal] = useState(false);

    return (
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4 flex justify-between items-center">
                <h4 className="text-xl font-bold text-white">{categoria.nombre}</h4>
                {categoria.delegado && (
                    <div className="flex items-center text-white bg-white/20 px-3 py-1 rounded-full text-sm">
                        Delegado: <span 
                            className="font-semibold ml-1.5 cursor-pointer hover:underline"
                            onClick={() => setShowProfileModal(true)}
                        >{categoria.delegado.name}</span>
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
                        findingsCount={findingsCount}
                        onFindingCreated={onFindingCreated}
                    />
                ) : (
                    <p className="text-center text-gray-500 py-8">
                        No hay requerimientos en esta categoría
                    </p>
                )}
            </div>

            {showProfileModal && categoria.delegado && (
                <UserProfileModal
                    isOpen={showProfileModal}
                    onClose={() => setShowProfileModal(false)}
                    userId={categoria.delegado.id}
                />
            )}
        </div>
    );
};
