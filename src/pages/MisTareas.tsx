import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { Modal } from '../components/Modal';
import { useUser } from '../hooks/useUser';
import { authService } from '../services/authService';
import { auditoriaService } from '../services/auditoriaService';

interface TareaFlat {
    auditoriaId: number;
    auditoriaEmpresa: string;
    auditoriaNit: string;
    categoriaId: number;
    categoriaNombre: string;
    subtareaId: number;
    subtareaNombre: string;
    formatoArchivo: string | null;
    archivoNombre: string | null;
    observaciones: string | null;
}

export const MisTareas: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useUser(() => navigate('/login'));
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [tareas, setTareas] = useState<TareaFlat[]>([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState<{
        isOpen: boolean;
        type: 'success' | 'error';
        title: string;
        message: string;
    }>({
        isOpen: false,
        type: 'success',
        title: '',
        message: ''
    });

    useEffect(() => {
        cargarTareas();
    }, []);

    const cargarTareas = async () => {
        try {
            setLoading(true);
            const response = await auditoriaService.getAuditorias();
            const auditorias = response.data || response;

            // Aplanar todas las subtareas de todas las auditorías
            const tareasFlat: TareaFlat[] = [];
            auditorias.forEach((auditoria: any) => {
                auditoria.categorias?.forEach((categoria: any) => {
                    categoria.subtareas?.forEach((subtarea: any) => {
                        tareasFlat.push({
                            auditoriaId: auditoria.id,
                            auditoriaEmpresa: auditoria.empresa || 'Sin nombre',
                            auditoriaNit: auditoria.nit || 'Sin NIT',
                            categoriaId: categoria.id,
                            categoriaNombre: categoria.nombre,
                            subtareaId: subtarea.id,
                            subtareaNombre: subtarea.nombre,
                            formatoArchivo: subtarea.formato_archivo,
                            archivoNombre: subtarea.archivo_nombre,
                            observaciones: subtarea.observaciones
                        });
                    });
                });
            });

            setTareas(tareasFlat);
        } catch (error) {
            console.error('Error al cargar tareas:', error);
            setModal({
                isOpen: true,
                type: 'error',
                title: 'Error',
                message: 'No se pudieron cargar las tareas'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (tarea: TareaFlat, file: File) => {
        try {
            // Validar formato de archivo si está especificado
            if (tarea.formatoArchivo) {
                const extension = file.name.split('.').pop()?.toLowerCase();
                const formatosPermitidos = tarea.formatoArchivo.toLowerCase().split(',').map(f => f.trim());

                if (extension && !formatosPermitidos.includes(extension)) {
                    setModal({
                        isOpen: true,
                        type: 'error',
                        title: 'Formato incorrecto',
                        message: `El archivo debe ser de tipo: ${tarea.formatoArchivo}`
                    });
                    return;
                }
            }

            // Subir el archivo al servidor
            const prevLoading = loading;
            setLoading(true);
            await auditoriaService.uploadFile(tarea.subtareaId, file);

            setModal({
                isOpen: true,
                type: 'success',
                title: '¡Éxito!',
                message: `Archivo "${file.name}" subido correctamente`
            });

            // Recargar tareas para actualizar el estado
            await cargarTareas();
            setLoading(prevLoading);
        } catch (error: any) {
            console.error('Error al subir archivo:', error);
            setModal({
                isOpen: true,
                type: 'error',
                title: 'Error',
                message: error.response?.data?.message || 'No se pudo subir el archivo'
            });
            setLoading(false);
        }
    };

    const handleCloseModal = () => {
        setModal({ ...modal, isOpen: false });
    };

    const handleLogout = async () => {
        try {
            await authService.logout();
            navigate('/login');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <Header
                userName={user?.name || 'Usuario'}
                onLogout={handleLogout}
                onNavigateToSettings={() => navigate('/perfil')}
                onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            />
            <Sidebar
                onLogout={handleLogout}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            <main className="lg:ml-32 ml-0 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                            Mis Tareas
                        </h1>
                        <p className="text-gray-600">
                            Aquí puedes ver y subir archivos para las auditorías asignadas
                        </p>
                    </div>

                    {/* Lista de Tareas */}
                    <div className="bg-white shadow-xl rounded-2xl p-6">
                        {loading ? (
                            <div className="text-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
                                <p className="mt-4 text-gray-600">Cargando tareas...</p>
                            </div>
                        ) : tareas.length === 0 ? (
                            <div className="text-center py-12">
                                <svg
                                    className="mx-auto h-12 w-12 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    />
                                </svg>
                                <h3 className="mt-2 text-sm font-medium text-gray-900">
                                    No hay tareas disponibles
                                </h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Las tareas aparecerán aquí cuando se creen auditorías
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {tareas.map((tarea, index) => (
                                    <div
                                        key={`${tarea.subtareaId}-${index}`}
                                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                                    >
                                        {/* Información de la auditoría */}
                                        <div className="mb-3 pb-3 border-b border-gray-200">
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <svg className="h-4 w-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                </svg>
                                                <span className="font-semibold">{tarea.auditoriaEmpresa}</span>
                                                <span className="text-gray-400">•</span>
                                                <span>NIT: {tarea.auditoriaNit}</span>
                                            </div>
                                            <div className="mt-1 text-sm text-gray-600">
                                                <span className="font-medium text-blue-600">{tarea.categoriaNombre}</span>
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
                                                            <span className="font-medium">Formato requerido:</span>{' '}
                                                            <span className="text-orange-600 font-semibold">{tarea.formatoArchivo}</span>
                                                        </p>
                                                    )}
                                                    {tarea.observaciones && (
                                                        <p className="text-sm text-gray-600">
                                                            <span className="font-medium">Observaciones:</span> {tarea.observaciones}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Botón de subir archivo */}
                                            <div className="flex flex-col gap-2 items-end">
                                                <label className="cursor-pointer">
                                                    <input
                                                        type="file"
                                                        className="hidden"
                                                        accept={tarea.formatoArchivo ? `.${tarea.formatoArchivo.split(',').join(',.')}` : '*'}
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) {
                                                                handleFileUpload(tarea, file);
                                                            }
                                                        }}
                                                    />
                                                    <div className="px-4 py-2 bg-orange-500 text-white text-sm font-semibold rounded-lg hover:bg-orange-600 transition-colors text-center whitespace-nowrap">
                                                        📤 Subir archivo
                                                    </div>
                                                </label>

                                                {tarea.archivoNombre && (
                                                    <div className="flex items-center gap-1 text-xs text-green-600">
                                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                        <span>Archivo subido</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Modal
                isOpen={modal.isOpen}
                onClose={handleCloseModal}
                title={modal.title}
                message={modal.message}
                type={modal.type}
            />
        </div>
    );
};
