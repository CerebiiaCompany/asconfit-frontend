import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Header } from '../Header';
import { Sidebar } from '../Sidebar';
import { authService } from '../../services/authService';

export const AppLayout: React.FC = () => {
    const navigate = useNavigate();
    const { user, setUser } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error('Error logging out:', error);
        } finally {
            setUser(null);
            navigate('/login');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <Header
                user={user}
                userRole={user?.role?.nombre.toLowerCase() as any || "delegado"}
                onLogout={handleLogout}
                onNavigateToSettings={() => navigate('/perfil')}
                onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            />
            <Sidebar
                onLogout={handleLogout}
                userRole={(user?.role?.nombre as any) || "delegado"}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />
            <main className="lg:ml-32 ml-0 pt-20">
                <Outlet />
            </main>
        </div>
    );
};
