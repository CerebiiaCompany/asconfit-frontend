import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { Modal } from '../components/Modal';
import { useUser } from '../hooks/useUser';
import { authService } from '../services/authService';
import { auditoriaService } from '../services/auditoriaService';

export const TareaDetalle: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useUser(() => navigate('/login'));
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [auditoria, setAuditoria] = useState<any>(null);
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
        if (id) {
            cargarAuditoria();
        }
    }, [id]);

    const cargarAuditoria = async () => {
        try {
            setLoading(true);
            const data = await auditoriaService.getAuditoria(id!);
            setAuditoria(data);
        } catch (error) {
            console.error('Error al cargar auditoría:', error);
            setModal({
                isOpen: true,
                type: 'error',
                title: 'Error',
                message: 'No se pudo cargar la auditoría'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (subtareaId: string, file: File) => {
        try {
            // Aquí implementaremos la subida de archivos
            setModal({
                isOpen: true,
                type: 'success',
                title: '¡Éxito!',
                message: 'Archivo subido correctamente'
            });
        } catch (error) {
            setModal({
                isOpen: true,
                type: 'error',
                title: 'Error',
                message: 'No se pudo subir el archivo'
            });
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

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Cargando...</p>
                </div>
            </div>
        );
    }

    if (!auditoria) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600">No se encontró la auditoría</p>
                    <button
                        onClick={() => navigate('/mis-tareas')}
                        className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                    >
                        Volver
                    </button>
                </div>
            </div>
        );
    }

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
                userRole={(user?.role?.nombre as any) || 'delegado'}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            <main className="lg:ml-32 ml-0 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Breadcrumb */}
                    <div className="mb-4">
                        <div className="flex items-center space-x-2 text-gray-600">
                            <button
                                onClick={() => navigate('/mis-tareas')}
                                className="text-lg font-medium hover:text-gray-900 transition-colors"
                            >
                                Mis Tareas
                            </button>
                            <svg className="h-5 w-5 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M9 5l7 7-7 7" />
                            </svg>
                            <span className="text-lg font-medium text-gray-400">{auditoria.empresa}</span>
                        </div>
                    </div>

                    {/* Información de la Empresa */}
                    <div className="bg-white shadow-xl rounded-2xl p-6 mb-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">{auditoria.empresa}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-gray-600">NIT:</span>
                                <span className="ml-2 font-medium">{auditoria.nit}</span>
                            </div>
                            <div>
                                <span className="text-gray-600">Razón Social:</span>
                                <span className="ml-2 font-medium">{auditoria.razon_social}</span>
                            </div>
                            <div>
                                <span className="text-gray-600">Responsable:</span>
                                <span className="ml-2 font-medium">{auditoria.responsable}</span>
                            </div>
                            <div>
                                <span className="text-gray-600">Contacto:</span>
                                <span className="ml-2 font-medium">{auditoria.contacto}</span>
                            </div>
                        </div>
                    </div>

                    {/* Categorías y Requerimientos */}
                    <div className="space-y-6">
                        {auditoria.categorias?.map((categoria: any) => (
                            <div key={categoria.id} className="bg-white shadow-xl rounded-2xl p-6">
                                <h3 className="text-xl font-bold text-gray-800 mb-4">{categoria.nombre}</h3>

                                <div className="space-y-4">
                                    {categoria.subtareas?.map((subtarea: any) => (
                                        <div
                                            key={subtarea.id}
                                            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-gray-800 mb-2">
                                                        {subtarea.nombre}
                                                    </h4>
                                                    {subtarea.formato_archivo && (
                                                        <p className="text-sm text-gray-600">
                                                            Formato: <span className="font-medium">{subtarea.formato_archivo}</span>
                                                        </p>
                                                    )}
                                                    {subtarea.observaciones && (
                                                        <p className="text-sm text-gray-600 mt-1">
                                                            Observaciones: {subtarea.observaciones}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="flex flex-col gap-2">
                                                    <label className="cursor-pointer">
                                                        <input
                                                            type="file"
                                                            className="hidden"
                                                            onChange={(e) => {
                                                                const file = e.target.files?.[0];
                                                                if (file) {
                                                                    handleFileUpload(subtarea.id, file);
                                                                }
                                                            }}
                                                        />
                                                        <div className="px-4 py-2 bg-orange-500 text-white text-sm font-semibold rounded-lg hover:bg-orange-600 transition-colors text-center">
                                                            Subir archivo
                                                        </div>
                                                    </label>

                                                    {subtarea.archivo_nombre && (
                                                        <div className="text-xs text-green-600 text-center">
                                                            ✓ Archivo subido
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
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
