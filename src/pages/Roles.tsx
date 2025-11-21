import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { useAuth } from '../contexts/AuthContext';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { useUser } from '../hooks/useUser';
import { useRoles } from '../hooks/useRoles';
import { useRoleForm } from '../hooks/useRoleForm';
import { Role } from '../types/role';
import { roleService } from '../services/roleService';
import { RoleForm } from '../components/Roles/RoleForm';
import { RoleList } from '../components/Roles/RoleList';

export const Roles: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useUser(() => navigate('/login'));
    const { setUser } = useAuth();
    const { roles, loading, error, loadRoles, deleteRole } = useRoles();
    const { showForm, selectedRole, handleCreateNew, handleEdit, handleFormClose } = useRoleForm();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleDelete = async (id: string) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este rol?')) {
            try {
                await deleteRole(id);
            } catch (err) {
                console.error('Delete error:', err);
            }
        }
    };

    const handleFormSubmit = async (success: boolean) => {
        if (success) {
            handleFormClose();
            await loadRoles();
        }
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
                                Gestión de Roles
                            </h2>
                            <p className="mt-2 text-gray-600">
                                Administra los roles y permisos del sistema
                            </p>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
                            {error}
                        </div>
                    )}

                    {/* Roles List */}
                    <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-900">Lista de Roles</h3>
                            <button
                                onClick={handleCreateNew}
                                className="bg-primary-orange text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity font-medium"
                            >
                                Crear Nuevo Rol
                            </button>
                        </div>
                        <div className="p-6">
                            {showForm ? (
                                <RoleForm
                                    role={selectedRole}
                                    onClose={handleFormClose}
                                    onSubmit={handleFormSubmit}
                                />
                            ) : (
                                <RoleList
                                    roles={roles}
                                    loading={loading}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
