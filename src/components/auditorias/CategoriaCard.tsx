import React from 'react';
import { SubtareaTable } from './SubtareaTable';

interface CategoriaCardProps {
    categoria: any;
    uploadingSubtareaId: number | null;
    fileInputRefs: React.MutableRefObject<{ [key: number]: HTMLInputElement | null }>;
    onFileSelect: (subtareaId: number) => void;
    onFileChange: (event: React.ChangeEvent<HTMLInputElement>, subtareaId: number) => void;
    onOpenFile: (subtareaId: number, fileName: string) => void;
    getAcceptedFileTypes: (formatoArchivo: string) => string;
}

export const CategoriaCard: React.FC<CategoriaCardProps> = ({
    categoria,
    uploadingSubtareaId,
    fileInputRefs,
    onFileSelect,
    onFileChange,
    onOpenFile,
    getAcceptedFileTypes
}) => {
    return (
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4">
                <h4 className="text-xl font-bold text-white">{categoria.nombre}</h4>
            </div>

            <div className="px-6 py-4">
                {categoria.subtareas && categoria.subtareas.length > 0 ? (
                    <SubtareaTable
                        subtareas={categoria.subtareas}
                        uploadingSubtareaId={uploadingSubtareaId}
                        fileInputRefs={fileInputRefs}
                        onFileSelect={onFileSelect}
                        onFileChange={onFileChange}
                        onOpenFile={onOpenFile}
                        getAcceptedFileTypes={getAcceptedFileTypes}
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
