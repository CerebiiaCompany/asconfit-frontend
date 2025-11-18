import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { useAuth } from '../contexts/AuthContext';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { useUser } from '../hooks/useUser';
import { useEmpresas } from '../hooks/useEmpresas';
import { EmpresaStatsCard } from '../components/empresas/EmpresaStatsCard';
import { EmpresaSearchBar } from '../components/empresas/EmpresaSearchBar';
import { EmpresaEmptyState } from '../components/empresas/EmpresaEmptyState';

export const Empresas: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useUser(() => navigate('/login'));
    const { setUser } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { stats, loading } = useEmpresas();

    const handleNewEmpresa = () => {
        // TODO: Implementar modal o navegación para crear empresa
        console.log('Nueva empresa');
    };

    const handleLogout = async () => {
        try {
            await authService.logout();
            setUser(null);
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
                    {/* Header Card */}
                    <div className="bg-white overflow-hidden shadow-xl rounded-2xl mb-6">
                        <div className="bg-white px-6 py-8">
                            <h2 className="text-3xl font-bold text-gray-800">
                                Empresas
                            </h2>
                            <p className="mt-2 text-gray-600">
                                Administra las empresas registradas en el sistema
                            </p>
                        </div>
                    </div>

                    {/* Search and Actions */}
                    <EmpresaSearchBar
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        onNewEmpresa={handleNewEmpresa}
                    />

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                        <EmpresaStatsCard
                            title="Total Empresas"
                            value={stats.total}
                            color="green"
                            icon={
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            }
                        />

                        <EmpresaStatsCard
                            title="Activas"
                            value={stats.activas}
                            color="blue"
                            icon={
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            }
                        />

                        <EmpresaStatsCard
                            title="En Revisión"
                            value={stats.enRevision}
                            color="yellow"
                            icon={
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            }
                        />

                        <EmpresaStatsCard
                            title="Inactivas"
                            value={stats.inactivas}
                            color="gray"
                            icon={
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                </svg>
                            }
                        />
                    </div>

                    {/* Empresas List */}
                    <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">Lista de Empresas</h3>
                        </div>
                        <div className="p-6">
                            {loading ? (
                                <div className="text-center py-12">
                                    <p className="text-gray-500">Cargando...</p>
                                </div>
                            ) : (
                                <EmpresaEmptyState onNewEmpresa={handleNewEmpresa} />
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
