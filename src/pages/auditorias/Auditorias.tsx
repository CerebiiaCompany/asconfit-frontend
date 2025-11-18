import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { Header } from '../../components/Header';
import { Sidebar } from '../../components/Sidebar';
import { useUser } from '../../hooks/useUser';
import { useAuditorias } from '../../hooks/useAuditorias';
import { AuditoriaFilterBar } from '../../components/auditorias/AuditoriaFilterBar';
import { AuditoriaEmptyState } from '../../components/auditorias/AuditoriaEmptyState';
import { AuditoriaCardList } from '../../components/auditorias/AuditoriaCardList';

export const Auditorias: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useUser(() => navigate('/login'));
    const [searchTerm, setSearchTerm] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { auditorias, loading } = useAuditorias();

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
                    {/* Page Title */}
                    <h1 className="text-2xl font-semibold text-gray-800 mb-6">Auditorías</h1>

                    {/* Filter Bar */}
                    <AuditoriaFilterBar
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        onNewAuditoria={handleNewAuditoria}
                    />

                    {/* Auditorías List */}
                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                        </div>
                    ) : filteredAuditorias.length === 0 ? (
                        auditorias.length === 0 ? (
                            <AuditoriaEmptyState onNewAuditoria={handleNewAuditoria} />
                        ) : (
                            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                                <p className="text-gray-500">No se encontraron auditorías que coincidan con la búsqueda</p>
                            </div>
                        )
                    ) : (
                        <AuditoriaCardList
                            auditorias={filteredAuditorias}
                            onViewAuditoria={handleViewAuditoria}
                        />
                    )}
                </div>
            </main>
        </div>
    );
};
