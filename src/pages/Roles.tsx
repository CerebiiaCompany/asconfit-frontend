import React, { useState, useEffect } from 'react';
import { Role } from '../types/role';
import { roleService } from '../services/roleService';
import { RoleForm } from '../components/Roles/RoleForm';
import { RoleList } from '../components/Roles/RoleList';

export const Roles: React.FC = () => {
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);

    useEffect(() => {
        loadRoles();
    }, []);

    const loadRoles = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await roleService.getAllRoles();
            setRoles(data);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al cargar roles';
            console.error('Load roles error:', errorMessage);
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateNew = () => {
        setSelectedRole(null);
        setShowForm(true);
    };

    const handleEdit = (role: Role) => {
        setSelectedRole(role);
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este rol?')) {
            try {
                await roleService.deleteRole(id);
                setRoles(roles.filter(r => r.id !== id));
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Error al eliminar rol');
            }
        }
    };

    const handleFormClose = () => {
        setShowForm(false);
        setSelectedRole(null);
    };

    const handleFormSubmit = async (success: boolean) => {
        if (success) {
            handleFormClose();
            await loadRoles();
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Gestión de Roles</h1>
                <button
                    onClick={handleCreateNew}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Crear Nuevo Rol
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {showForm && (
                <RoleForm
                    role={selectedRole}
                    onClose={handleFormClose}
                    onSubmit={handleFormSubmit}
                />
            )}

            {!showForm && (
                <RoleList
                    roles={roles}
                    loading={loading}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )}
        </div>
    );
};
