import React, { useState } from 'react';
import { UserSettingsProps, TabType } from '../types/userSettings.types';
import { useUserProfile } from '../hooks/useUserProfile';
import { usePasswordUpdate } from '../hooks/usePasswordUpdate';

export const UserSettings: React.FC<UserSettingsProps> = ({ onBack, onLogout }) => {
    const [activeTab, setActiveTab] = useState<TabType>('profile');

    const {
        user,
        loading,
        name,
        setName,
        email,
        setEmail,
        profileLoading,
        profileMessage,
        handleProfileUpdate
    } = useUserProfile();

    const {
        currentPassword,
        setCurrentPassword,
        newPassword,
        setNewPassword,
        confirmPassword,
        setConfirmPassword,
        passwordLoading,
        passwordMessage,
        handlePasswordUpdate
    } = usePasswordUpdate();

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

    return (
        <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-6">
                <button
                    onClick={onBack}
                    className="flex items-center text-gray-600 hover:text-gray-900 transition duration-150"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Volver al Dashboard
                </button>
                <h1 className="mt-4 text-3xl font-bold text-gray-900">Configuración de Usuario</h1>
                <p className="mt-2 text-gray-600">Administra tu información personal y seguridad</p>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="border-b border-gray-200">
                    <nav className="flex -mb-px">
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`py-4 px-6 text-center border-b-2 font-medium text-sm transition duration-150 ${activeTab === 'profile'
                                ? 'border-purple-600 text-purple-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            <div className="flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Perfil
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveTab('password')}
                            className={`py-4 px-6 text-center border-b-2 font-medium text-sm transition duration-150 ${activeTab === 'password'
                                ? 'border-purple-600 text-purple-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            <div className="flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                Contraseña
                            </div>
                        </button>
                    </nav>
                </div>

                {/* Profile Tab */}
                {activeTab === 'profile' && (
                    <div className="p-6">
                        <form onSubmit={handleProfileUpdate} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                    Nombre completo
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition duration-150"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Correo electrónico
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition duration-150"
                                    required
                                />
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-600">
                                    <span className="font-medium">ID de Usuario:</span> #{user?.id}
                                </p>
                            </div>

                            {profileMessage && (
                                <div className={`p-4 rounded-lg ${profileMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                                    }`}>
                                    {profileMessage.text}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={profileLoading}
                                className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                            >
                                {profileLoading ? 'Guardando...' : 'Guardar cambios'}
                            </button>
                        </form>
                    </div>
                )}

                {/* Password Tab */}
                {activeTab === 'password' && (
                    <div className="p-6">
                        <form onSubmit={handlePasswordUpdate} className="space-y-6">
                            <div>
                                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                    Contraseña actual
                                </label>
                                <input
                                    type="password"
                                    id="currentPassword"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition duration-150"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                    Nueva contraseña
                                </label>
                                <input
                                    type="password"
                                    id="newPassword"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition duration-150"
                                    required
                                    minLength={8}
                                />
                                <p className="mt-1 text-sm text-gray-500">Mínimo 8 caracteres</p>
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirmar nueva contraseña
                                </label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition duration-150"
                                    required
                                />
                            </div>

                            {passwordMessage && (
                                <div className={`p-4 rounded-lg ${passwordMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                                    }`}>
                                    {passwordMessage.text}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={passwordLoading}
                                className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                            >
                                {passwordLoading ? 'Actualizando...' : 'Actualizar contraseña'}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};
