import React, { useEffect, useState } from 'react';
import { authService, User } from '../services/authService';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { UserSettings } from './UserSettings';

interface DashboardProps {
    onLogout: () => void;
}

type DashboardView = 'home' | 'settings';

export const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentView, setCurrentView] = useState<DashboardView>('home');

    useEffect(() => {
        const loadUser = async () => {
            try {
                const userData = await authService.getCurrentUser();
                setUser(userData);
            } catch (error) {
                console.error('Error loading user:', error);
                onLogout();
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, [onLogout]);

    const handleLogout = async () => {
        try {
            await authService.logout();
            onLogout();
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <svg className="animate-spin h-12 w-12 text-purple-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="mt-4 text-gray-600">Cargando...</p>
                </div>
            </div>
        );
    }

    if (currentView === 'settings') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <Header userName={user?.name} onLogout={handleLogout} onNavigateToSettings={() => setCurrentView('settings')} />
                <Sidebar onLogout={handleLogout} />
                <div className="ml-32 pt-20">
                    <UserSettings onBack={() => setCurrentView('home')} onLogout={handleLogout} />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Header */}
            <Header userName={user?.name} onLogout={handleLogout} onNavigateToSettings={() => setCurrentView('settings')} />

            {/* Sidebar */}
            <Sidebar onLogout={handleLogout} />

            {/* Main Content */}
            <main className="ml-32 pt-20 py-6 px-4 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    {/* Welcome Card */}
                    <div className="bg-white overflow-hidden shadow-xl rounded-2xl mb-6">
                        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-8">
                            <h2 className="text-3xl font-bold text-white">
                                ¡Bienvenido de vuelta, {user?.name}! 👋
                            </h2>
                            <p className="mt-2 text-purple-100">
                                Estás autenticado exitosamente en Asconfit
                            </p>
                        </div>
                    </div>

                    {/* User Info Card */}
                    <div className="bg-white overflow-hidden shadow-xl rounded-2xl">
                        <div className="px-6 py-8">
                            <h3 className="text-xl font-semibold text-gray-900 mb-6">
                                Información de Usuario
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                                    <div className="flex-shrink-0">
                                        <svg className="h-8 w-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-500">Nombre</p>
                                        <p className="text-lg font-semibold text-gray-900">{user?.name}</p>
                                    </div>
                                </div>

                                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                                    <div className="flex-shrink-0">
                                        <svg className="h-8 w-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-500">Email</p>
                                        <p className="text-lg font-semibold text-gray-900">{user?.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                                    <div className="flex-shrink-0">
                                        <svg className="h-8 w-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-500">ID de Usuario</p>
                                        <p className="text-lg font-semibold text-gray-900">#{user?.id}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="bg-white overflow-hidden shadow-lg rounded-xl p-6 border-l-4 border-purple-600">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 bg-purple-100 rounded-lg p-3">
                                    <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Estado</p>
                                    <p className="text-lg font-semibold text-gray-900">Activo</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-lg rounded-xl p-6 border-l-4 border-green-600">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 bg-green-100 rounded-lg p-3">
                                    <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Seguridad</p>
                                    <p className="text-lg font-semibold text-gray-900">Protegido</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-lg rounded-xl p-6 border-l-4 border-blue-600">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 bg-blue-100 rounded-lg p-3">
                                    <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">API</p>
                                    <p className="text-lg font-semibold text-gray-900">Conectado</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
