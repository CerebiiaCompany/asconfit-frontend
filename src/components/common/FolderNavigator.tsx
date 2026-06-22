import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';

interface Carpeta {
    id: number;
    nombre: string;
    subcarpetas?: Carpeta[];
}

interface FolderNavigatorProps {
    empresaId: number;
    onFolderSelect: (carpetaId: number | null, carpetaNombre: string) => void;
    selectedFolderId: number | null;
}

export const FolderNavigator: React.FC<FolderNavigatorProps> = ({
    empresaId,
    onFolderSelect,
    selectedFolderId
}) => {
    const [carpetas, setCarpetas] = useState<Carpeta[]>([]);
    const [currentCarpeta, setCurrentCarpeta] = useState<Carpeta | null>(null);
    const [breadcrumbs, setBreadcrumbs] = useState<Array<{ id: number | null; nombre: string }>>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Cargar carpetas raíz
    useEffect(() => {
        const fetchCarpetas = async () => {
            try {
                setLoading(true);
                setError(null);
                console.log('Fetching carpetas for empresa:', empresaId);
                const data = await api.get<Carpeta[]>(`/empresas/${empresaId}/carpetas`);
                console.log('Response data:', data);

                if (!data) {
                    console.warn('Response data is null or undefined');
                    setCarpetas([]);
                } else if (!Array.isArray(data)) {
                    console.warn('Response data is not an array:', typeof data);
                    setCarpetas([]);
                } else {
                    setCarpetas(data);
                }

                setCurrentCarpeta(null);
                setBreadcrumbs([{ id: null, nombre: 'Raíz' }]);
            } catch (err: any) {
                console.error('Error al cargar carpetas:', err);
                setError(`No se pudieron cargar las carpetas: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchCarpetas();
    }, [empresaId]);

    const handleNavigateTo = async (carpeta: Carpeta) => {
        try {
            setLoading(true);
            setError(null);

            // Cargar subcarpetas de la carpeta seleccionada
            const data = await api.get<Carpeta[]>(`/carpetas/${carpeta.id}/subcarpetas`);

            setCurrentCarpeta(carpeta);
            setCarpetas(data);
            setBreadcrumbs([
                ...breadcrumbs,
                { id: carpeta.id, nombre: carpeta.nombre }
            ]);
        } catch (err) {
            console.error('Error al navegar a carpeta:', err);
            setError('No se pudieron cargar las subcarpetas');
        } finally {
            setLoading(false);
        }
    };

    const handleNavigateToRoot = () => {
        if (breadcrumbs && breadcrumbs.length > 1) {
            setCurrentCarpeta(null);
            setCarpetas([]);
            setBreadcrumbs([{ id: null, nombre: 'Raíz' }]);
            // Recargar carpetas raíz
            const fetchCarpetas = async () => {
                try {
                    setLoading(true);
                    const data = await api.get<Carpeta[]>(`/empresas/${empresaId}/carpetas`);
                    setCarpetas(data);
                } catch (err) {
                    setError('No se pudieron cargar las carpetas');
                } finally {
                    setLoading(false);
                }
            };
            fetchCarpetas();
        }
    };

    const handleNavigateToBreadcrumb = async (index: number) => {
        if (!breadcrumbs || index < 0 || index >= breadcrumbs.length) {
            return;
        }

        if (index === 0) {
            handleNavigateToRoot();
            return;
        }

        const targetBreadcrumb = breadcrumbs[index];
        const newBreadcrumbs = breadcrumbs.slice(0, index + 1);

        try {
            setLoading(true);
            setError(null);

            const data = await api.get<Carpeta[]>(`/carpetas/${targetBreadcrumb.id}/subcarpetas`);

            setCurrentCarpeta({
                id: targetBreadcrumb.id!,
                nombre: targetBreadcrumb.nombre
            });
            setCarpetas(data);
            setBreadcrumbs(newBreadcrumbs);
        } catch (err) {
            console.error('Error al navegar a breadcrumb:', err);
            setError('No se pudieron cargar las carpetas');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectFolder = (carpetaId: number, carpetaNombre: string) => {
        onFolderSelect(carpetaId, carpetaNombre);
    };

    const handleSelectNoFolder = () => {
        onFolderSelect(null, 'Sin carpeta');
    };

    return (
        <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">
                Seleccionar carpeta de destino
            </h4>

            {/* Breadcrumbs */}
            <div className="flex items-center gap-1 mb-3 text-xs text-gray-600 bg-gray-50 p-2 rounded">
                {breadcrumbs && breadcrumbs.length > 0 && breadcrumbs.map((crumb, index) => (
                    <div key={index} className="flex items-center gap-1">
                        {index > 0 && <span className="text-gray-400">/</span>}
                        <button
                            onClick={() => handleNavigateToBreadcrumb(index)}
                            className={`${index === breadcrumbs.length - 1
                                ? 'text-gray-700 font-medium'
                                : 'text-orange-600 hover:text-orange-700 underline'
                                }`}
                        >
                            {crumb.nombre}
                        </button>
                    </div>
                ))}
            </div>

            {/* Contenido */}
            {loading ? (
                <div className="text-center py-4">
                    <svg className="animate-spin h-5 w-5 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>
            ) : error ? (
                <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                    {error}
                </div>
            ) : (
                <div className="space-y-3">
                    {/* Carpetas disponibles - Layout horizontal */}
                    {carpetas && carpetas.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {/* Opción "No subir a carpeta" */}
                            <button
                                onClick={handleSelectNoFolder}
                                className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-colors text-sm border-2 ${selectedFolderId === null
                                    ? 'border-orange-500 bg-orange-50 text-orange-700 font-medium'
                                    : 'border-gray-200 bg-white text-gray-700 hover:border-orange-300 hover:bg-orange-50'
                                    }`}
                            >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                <span>Sin carpeta</span>
                            </button>

                            {/* Carpetas */}
                            {carpetas.map((carpeta) => (
                                <div key={carpeta.id} className="flex flex-col gap-1">
                                    <button
                                        onClick={() => handleSelectFolder(carpeta.id, carpeta.nombre)}
                                        className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-colors text-sm border-2 ${selectedFolderId === carpeta.id
                                            ? 'border-orange-500 bg-orange-50 text-orange-700 font-medium'
                                            : 'border-gray-200 bg-white text-gray-700 hover:border-orange-300 hover:bg-orange-50'
                                            }`}
                                    >
                                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"></path>
                                        </svg>
                                        <span>{carpeta.nombre}</span>
                                        {carpeta.subcarpetas && carpeta.subcarpetas.length > 0 && (
                                            <span className="text-xs text-gray-500 ml-1">
                                                ({carpeta.subcarpetas.length})
                                            </span>
                                        )}
                                    </button>

                                    {/* Subcarpetas - mostrar directamente */}
                                    {carpeta.subcarpetas && carpeta.subcarpetas.length > 0 && (
                                        <div className="flex flex-wrap gap-2 ml-4">
                                            {carpeta.subcarpetas.map((subcarpeta) => (
                                                <button
                                                    key={subcarpeta.id}
                                                    onClick={() => handleSelectFolder(subcarpeta.id, `${carpeta.nombre} / ${subcarpeta.nombre}`)}
                                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-xs border ${selectedFolderId === subcarpeta.id
                                                        ? 'border-orange-500 bg-orange-50 text-orange-700 font-medium'
                                                        : 'border-gray-200 bg-white text-gray-700 hover:border-orange-300 hover:bg-orange-50'
                                                        }`}
                                                >
                                                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"></path>
                                                    </svg>
                                                    <span>{subcarpeta.nombre}</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-4 text-gray-500 text-sm">
                            {currentCarpeta ? 'No hay subcarpetas disponibles' :
                                error ? 'Error cargando carpetas' :
                                    'No hay carpetas disponibles o sin permisos para verlas'}
                        </div>
                    )}
                </div>
            )}

            {/* Resumen de selección */}
            {selectedFolderId !== null && (
                <div className="mt-3 p-2 bg-orange-50 border border-orange-200 rounded-lg text-xs text-orange-700">
                    <span className="font-semibold">Carpeta seleccionada:</span> El archivo se guardará en esta carpeta además de en la auditoría.
                </div>
            )}
        </div>
    );
};
