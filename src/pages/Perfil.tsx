import React from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { UserSettings } from '../components/UserSettings';
import { useUser } from '../hooks/useUser';

export const Perfil: React.FC = () => {
    const navigate = useNavigate();
    const { user, loading: userLoading } = useUser(() => navigate('/login'));

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
            />
            <Sidebar onLogout={handleLogout} />
            <div className="ml-32 pt-20">
                <UserSettings onBack={() => navigate('/dashboard')} onLogout={handleLogout} />
            </div>
        </div>
    );
};
