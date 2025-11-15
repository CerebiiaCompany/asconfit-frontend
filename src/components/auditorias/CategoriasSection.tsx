import React from 'react';
import { Categoria, Subtarea } from '../../types/auditoria.types';
import { SubtareaItem } from './SubtareaItem';

interface CategoriasSectionProps {
    categorias: Categoria[];
    onAddCategoria: () => void;
    onRemoveCategoria: (id: string) => void;
    onCategoriaChange: (id: string, value: string) => void;
    onAddSubtarea: (categoriaId: string) => void;
    onRemoveSubtarea: (categoriaId: string, subtareaId: string) => void;
    onSubtareaChange: (categoriaId: string, subtareaId: string, field: keyof Subtarea, value: string) => void;
    onLoadPlantilla: (categoriaId: string, codigo: string) => void;
}

export const CategoriasSection: React.FC<CategoriasSectionProps> = ({
    categorias,
    onAddCategoria,
    onRemoveCategoria,
    onCategoriaChange,
    onAddSubtarea,
    onRemoveSubtarea,
    onSubtareaChange,
    onLoadPlantilla
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

            <div className="space-y-6">
                {categorias.map((categoria) => (
                    <div key={categoria.id} className="bg-[#E8E8E8] p-3 sm:p-4 rounded-lg">
                        {/* Header de Categoría */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 flex-1">
                                <label className="text-sm text-gray-600 sm:w-24 flex-shrink-0">Categoría</label>
                                <select
                                    value={categoria.nombre}
                                    onChange={(e) => onCategoriaChange(categoria.id, e.target.value)}
                                    className="flex-1 sm:max-w-md px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-[#F3F3F3] text-sm sm:text-base"
                                >
                                    <option value="">Selecciona la categoría requerida</option>
                                    <option value="documentos_corporativos">Documentos Corporativos</option>
                                    <option value="libros_contables">Libros Contables</option>
                                    <option value="informacion_financiera">Información Financiera</option>
                                    <option value="impuestos">Impuestos</option>
                                    <option value="nomina">Nómina</option>
                                </select>
                                {categoria.nombre && categoria.subtareas.length === 0 && (
                                    <button
                                        type="button"
                                        onClick={() => onLoadPlantilla(categoria.id, categoria.nombre)}
                                        className="px-3 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors whitespace-nowrap"
                                    >
                                        Cargar plantilla
                                    </button>
                                )}
                            </div>
                            <button
                                onClick={() => onRemoveCategoria(categoria.id)}
                                className="self-end sm:self-auto p-2 text-white bg-[#9A9A9A] hover:bg-red-500 rounded-full transition-colors flex-shrink-0"
                                title="Eliminar categoría"
                            >
                                <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>

                        {/* Subtareas */}
                        {categoria.nombre && (
                            <div className="mt-4">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-sm font-medium text-gray-700">Requerimientos</h3>
                                    <button
                                        onClick={() => onAddSubtarea(categoria.id)}
                                        className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                                    >
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        Agregar requerimiento
                                    </button>
                                </div>

                                {categoria.subtareas.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500 text-sm">
                                        No hay requerimientos. Haz clic en "Agregar requerimiento" para comenzar.
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {categoria.subtareas.map((subtarea) => (
                                            <SubtareaItem
                                                key={subtarea.id}
                                                subtarea={subtarea}
                                                onRemove={() => onRemoveSubtarea(categoria.id, subtarea.id)}
                                                onChange={(field, value) => onSubtareaChange(categoria.id, subtarea.id, field, value)}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
