import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { Header } from '../../components/Header';
import { Sidebar } from '../../components/Sidebar';
import { useUser } from '../../hooks/useUser';
import { useAuditorias } from '../../hooks/useAuditorias';
import { AuditoriaStatsCard } from '../../components/auditorias/AuditoriaStatsCard';
import { AuditoriaSearchBar } from '../../components/auditorias/AuditoriaSearchBar';
import { AuditoriaEmptyState } from '../../components/auditorias/AuditoriaEmptyState';
import { AuditoriaList } from '../../components/auditorias/AuditoriaList';

export const Auditorias: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useUser(() => navigate('/login'));
    const [searchTerm, setSearchTerm] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { auditorias, stats, loading } = useAuditorias();

    // Filtrar auditorías según el término de búsqueda
    const filteredAuditorias = auditorias.filter(auditoria => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        return (
            auditoria.empresa?.toLowerCase().includes(term) ||
            auditoria.nit?.toLowerCase().includes(term) ||
            auditoria.razon_social?.toLowerCase().includes(term) ||
            auditoria.responsable?.toLowerCase().includes(term)
        );
    });

    const handleNewAuditoria = () => {
        navigate('/auditorias/nueva');
    };

    const handleViewAuditoria = (id: number) => {
        navigate(`/auditorias/${id}`);
    };

    const handleLogout = async () => {
        try {
            await authService.logout();
            navigate('/login');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const statsConfig = [
        {
            title: 'Total',
            value: stats.total,
            icon: (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
            borderColor: 'border-blue-600',
            bgColor: 'bg-blue-100',
            iconColor: 'text-blue-600'
        },
        {
            title: 'Completadas',
            value: stats.completadas,
            icon: (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            borderColor: 'border-green-600',
            bgColor: 'bg-green-100',
            iconColor: 'text-green-600'
        },
        {
            title: 'En Progreso',
            value: stats.en_progreso,
            icon: (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            borderColor: 'border-yellow-600',
            bgColor: 'bg-yellow-100',
            iconColor: 'text-yellow-600'
        },
        {
            title: 'Pendientes',
            value: stats.pendientes,
            icon: (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            ),
            borderColor: 'border-red-600',
            bgColor: 'bg-red-100',
            iconColor: 'text-red-600'
        }
    ];

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
                    {/* Header Card */}
                    <div className="bg-white overflow-hidden shadow-xl rounded-2xl mb-6">
                        <div className="bg-white px-6 py-8">
                            <h2 className="text-3xl font-bold text-gray-800">
                                Auditorías
                            </h2>
                            <p className="mt-2 text-gray-600">
                                Gestiona y revisa las auditorías del sistema
                            </p>
                        </div>
                    </div>

                    {/* Search and Actions */}
                    <AuditoriaSearchBar
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        onNewAuditoria={handleNewAuditoria}
                    />

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                        {statsConfig.map((stat, index) => (
                            <AuditoriaStatsCard key={index} {...stat} />
                        ))}
                    </div>

                    {/* Auditorías List */}
                    <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">Lista de Auditorías</h3>
                        </div>
                        <div className="p-6">
                            {loading ? (
                                <div className="flex justify-center items-center py-12">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                                </div>
                            ) : filteredAuditorias.length === 0 ? (
                                auditorias.length === 0 ? (
                                    <AuditoriaEmptyState onNewAuditoria={handleNewAuditoria} />
                                ) : (
                                    <div className="text-center py-12">
                                        <p className="text-gray-500">No se encontraron auditorías que coincidan con la búsqueda</p>
                                    </div>
                                )
                            ) : (
                                <AuditoriaList
                                    auditorias={filteredAuditorias}
                                    onViewAuditoria={handleViewAuditoria}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
