import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { authService } from '../../services/authService';
import { auditoriaService } from '../../services/auditoriaService';
import { Header } from '../../components/Header';
import { Sidebar } from '../../components/Sidebar';
import { useUser } from '../../hooks/useUser';
import { Auditoria } from '../../types/auditoria';

export const AuditoriaDetalle: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { user } = useUser(() => navigate('/login'));
    const [auditoria, setAuditoria] = useState<Auditoria | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        if (id) {
            fetchAuditoria();
        }
    }, [id]);

    const fetchAuditoria = async () => {
        try {
            setLoading(true);
            const response = await auditoriaService.getAuditoria(id!);
            setAuditoria(response);
        } catch (error) {
            console.error('Error al cargar la auditoría:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await authService.logout();
            navigate('/login');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const getEstadoBadge = (estado: Auditoria['estado']) => {
        const badges = {
            borrador: 'bg-gray-100 text-gray-800',
            pendiente: 'bg-red-100 text-red-800',
            en_progreso: 'bg-yellow-100 text-yellow-800',
            completada: 'bg-green-100 text-green-800'
        };
        const labels = {
            borrador: 'Borrador',
            pendiente: 'Pendiente',
            en_progreso: 'En Progreso',
            completada: 'Completada'
        };
        return (
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${badges[estado]}`}>
                {labels[estado]}
            </span>
        );
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
                        {getEstadoBadge(auditoria.estado)}
                    </div>

                    {/* Información de la Auditoría */}
                    <div className="bg-white shadow-xl rounded-2xl overflow-hidden mb-6">
                        <div className="px-6 py-8">
                            <h2 className="text-3xl font-bold text-gray-800 mb-6">
                                Detalle de Auditoría
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Empresa</label>
                                    <p className="text-gray-900">{auditoria.empresa || '-'}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">NIT</label>
                                    <p className="text-gray-900">{auditoria.nit || '-'}</p>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Razón Social</label>
                                    <p className="text-gray-900">{auditoria.razon_social || '-'}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Actividad Económica</label>
                                    <p className="text-gray-900">{auditoria.actividad_economica || '-'}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                                    <p className="text-gray-900">{auditoria.direccion || '-'}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Responsable</label>
                                    <p className="text-gray-900">{auditoria.responsable || '-'}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Contacto</label>
                                    <p className="text-gray-900">{auditoria.contacto || '-'}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">PT</label>
                                    <p className="text-gray-900">{auditoria.pt || '-'}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Inicial</label>
                                    <p className="text-gray-900">{auditoria.fecha_inicial || '-'}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Corte</label>
                                    <p className="text-gray-900">{auditoria.fecha_corte || '-'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
