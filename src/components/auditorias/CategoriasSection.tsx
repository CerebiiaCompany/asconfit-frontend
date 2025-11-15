import React from 'react';
import { Categoria } from '../../types/auditoria.types';

interface CategoriasSectionProps {
    categorias: Categoria[];
    onAddCategoria: () => void;
    onRemoveCategoria: (id: string) => void;
    onCategoriaChange: (id: string, value: string) => void;
}

export const CategoriasSection: React.FC<CategoriasSectionProps> = ({
    categorias,
    onAddCategoria,
    onRemoveCategoria,
    onCategoriaChange
}) => {
    return (
        <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-base sm:text-lg font-semibold text-gray-800">Crear categorías requeridas</h2>
                <button
                    onClick={onAddCategoria}
                    className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex-shrink-0"
                >
                    <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                </button>
            </div>

            <div className="space-y-3 sm:space-y-4">
                {categorias.map((categoria) => (
                    <div key={categoria.id} className="bg-[#E8E8E8] p-3 sm:p-4 rounded-lg">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 flex-1">
                                <label className="text-sm text-gray-600 sm:w-24 flex-shrink-0">Categoría</label>
                                <select
                                    value={categoria.nombre}
                                    onChange={(e) => onCategoriaChange(categoria.id, e.target.value)}
                                    className="flex-1 sm:max-w-md px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-[#F3F3F3] text-sm sm:text-base"
                                >
                                    <option value="">Selecciona la categoría requerida</option>
                                    <option value="categoria1">Categoría 1</option>
                                    <option value="categoria2">Categoría 2</option>
                                    <option value="categoria3">Categoría 3</option>
                                </select>
                            </div>
                            <button
                                onClick={() => onRemoveCategoria(categoria.id)}
                                className="self-end sm:self-auto p-2 text-white bg-[#9A9A9A] hover:bg-red-500 rounded-full transition-colors flex-shrink-0"
                            >
                                <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
