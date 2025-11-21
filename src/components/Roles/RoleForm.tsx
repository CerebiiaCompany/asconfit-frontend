import React, { useState, useEffect } from 'react';
import { Role } from '../../types/role';
import { roleService } from '../../services/roleService';
import { ALL_MENU_ITEMS } from '../../config/menuConfig';

interface RoleFormProps {
    role: Role | null;
    onClose: () => void;
    onSubmit: (success: boolean) => void;
}

export const RoleForm: React.FC<RoleFormProps> = ({ role, onClose, onSubmit }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (role) {
            setName(role.name);
            setDescription(role.description || '');
            setSelectedPermissions(role.permissions);
        }
    }, [role]);

    const handlePermissionChange = (menuItemId: string) => {
        setSelectedPermissions(prev =>
            prev.includes(menuItemId)
                ? prev.filter(id => id !== menuItemId)
                : [...prev, menuItemId]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (!name.trim()) {
                setError('El nombre del rol es requerido');
                setLoading(false);
                return;
            }

            if (selectedPermissions.length === 0) {
                setError('Debes seleccionar al menos un permiso');
                setLoading(false);
                return;
            }

            const payload = {
                name: name.trim(),
                description: description.trim() || undefined,
                permissions: selectedPermissions,
            };

            if (role?.id) {
                await roleService.updateRole(role.id.toString(), payload);
            } else {
                await roleService.createRole(payload);
            }

            onSubmit(true);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al guardar rol';
            setError(errorMessage);
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-screen overflow-y-auto">
                <h2 className="text-2xl font-bold mb-6">
                    {role ? 'Editar Rol' : 'Crear Nuevo Rol'}
                </h2>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nombre del Rol
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Ej: Administrador, Auditor"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Descripción
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Descripción del rol"
                            rows={3}
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-4">
                            Asignación de Permisos
                        </label>
                        <div className="space-y-3 border border-gray-300 rounded p-4 bg-gray-50">
                            {ALL_MENU_ITEMS.map(item => (
                                <div key={item.id} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id={item.id}
                                        checked={selectedPermissions.includes(item.id)}
                                        onChange={() => handlePermissionChange(item.id)}
                                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                    />
                                    <label
                                        htmlFor={item.id}
                                        className="ml-3 text-sm font-medium text-gray-700 cursor-pointer"
                                    >
                                        {item.label}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
                            disabled={loading}
                        >
                            {loading ? 'Guardando...' : 'Guardar Rol'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
