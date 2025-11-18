import React from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { useAuth } from '../contexts/AuthContext';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { UserSettings } from '../components/UserSettings';
import { useUser } from '../hooks/useUser';

export const Perfil: React.FC = () => {
    const navigate = useNavigate();
    const { user, loading: userLoading } = useUser(() => navigate('/login'));
    const { setUser } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

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
            <div className="lg:ml-32 ml-0 pt-20">
                {userLoading ? (
                    <div className="flex items-center justify-center min-h-[calc(100vh-5rem)]">
                        <div className="text-center">
                            <svg className="animate-spin h-12 w-12 text-orange-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <p className="mt-4 text-gray-600">Cargando...</p>
                        </div>
                    </div>
                ) : (
                    <UserSettings
                        initialUser={user!}
                        onBack={() => navigate('/dashboard')}
                        onLogout={handleLogout}
                    />
                )}
            </div>
        </div>
    );
};
