import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { authService } from '../../services/authService';
import { Header } from '../../components/Header';
import { Sidebar } from '../../components/Sidebar';
import { Modal } from '../../components/Modal';
import { useUser } from '../../hooks/useUser';
import { useAuditoriaDetalle } from '../../hooks/useAuditoriaDetalle';
import { useFileUpload } from '../../hooks/useFileUpload';
import { AuditoriaInfoCard } from '../../components/auditorias/AuditoriaInfoCard';
import { CategoriaCard } from '../../components/auditorias/CategoriaCard';
import { EstadoBadge } from '../../components/auditorias/EstadoBadge';

export const AuditoriaDetalle: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { user } = useUser(() => navigate('/login'));
    const { auditoria, loading, refetch } = useAuditoriaDetalle(id);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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

    const {
        uploadingSubtareaId,
        fileInputRefs,
        getAcceptedFileTypes,
        handleFileSelect,
        handleFileChange: uploadFile,
        handleOpenFile
    } = useFileUpload({
        onSuccess: async () => {
            setModal({
                isOpen: true,
                type: 'success',
                title: 'Éxito',
                message: 'Archivo subido exitosamente'
            });
            await refetch();
        },
        onError: (message) => {
            setModal({
                isOpen: true,
                type: 'error',
                title: 'Error',
                message
            });
        }
    });

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
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!auditoria) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-500 mb-4">No se encontró la auditoría</p>
                    <button
                        onClick={() => navigate('/auditorias')}
                        className="text-blue-600 hover:text-blue-800"
                    >
                        Volver a auditorías
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
            <main className="lg:ml-32 ml-0 pt-20 py-6 px-4 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    {/* Header */}
                    <div className="mb-6 flex items-center justify-between">
                        <button
                            onClick={() => navigate('/auditorias')}
                            className="flex items-center text-gray-600 hover:text-gray-900"
                        >
                            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Volver a auditorías
                        </button>
                        <EstadoBadge estado={auditoria.estado} />
                    </div>

                    {/* Información de la Auditoría */}
                    <AuditoriaInfoCard auditoria={auditoria} />

                    {/* Categorías y Subtareas */}
                    {auditoria.categorias && auditoria.categorias.length > 0 && (
                        <div className="space-y-6">
                            <h3 className="text-2xl font-bold text-gray-800">Categorías y Requerimientos</h3>

                            {auditoria.categorias.map((categoria: any) => (
                                <CategoriaCard
                                    key={categoria.id}
                                    categoria={categoria}
                                    uploadingSubtareaId={uploadingSubtareaId}
                                    fileInputRefs={fileInputRefs}
                                    onFileSelect={handleFileSelect}
                                    onFileChange={uploadFile}
                                    onOpenFile={handleOpenFile}
                                    getAcceptedFileTypes={getAcceptedFileTypes}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Modal */}
            <Modal
                isOpen={modal.isOpen}
                onClose={() => setModal({ ...modal, isOpen: false })}
                title={modal.title}
                message={modal.message}
                type={modal.type}
            />
        </div>
    );
};
