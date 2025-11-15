import React from 'react';
import { authService } from '../services/authService';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { UserSettings } from '../components/UserSettings';
import { Auditorias } from './Auditorias';
import { Empresas } from './Empresas';
import { DashboardProps } from '../types/dashboard';
import { useUser } from '../hooks/useUser';
import { useDashboardNavigation } from '../hooks/useDashboardNavigation';
import { LoadingSpinner } from '../components/dashboard/LoadingSpinner';
import { HomeView } from '../components/dashboard/HomeView';

export const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
    const { user, loading } = useUser(onLogout);
    const { currentView, navigateTo } = useDashboardNavigation();

    const handleLogout = async () => {
        try {
            await authService.logout();
            onLogout();
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    const renderContent = () => {
        switch (currentView) {
            case 'inicio':
                return <HomeView user={user} />;

            case 'auditorias':
                return <Auditorias />;

            case 'empresas':
                return <Empresas />;

            case 'perfil':
            case 'settings':
                return (
                    <div className="ml-32 pt-20">
                        <UserSettings onBack={() => navigateTo('inicio')} onLogout={handleLogout} />
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <Header userName={user?.name} onLogout={handleLogout} onNavigateToSettings={() => navigateTo('perfil')} />
            <Sidebar
                onLogout={handleLogout}
                activeView={currentView}
                onNavigate={(view) => navigateTo(view as any)}
            />
            {renderContent()}
        </div>
    );
};
