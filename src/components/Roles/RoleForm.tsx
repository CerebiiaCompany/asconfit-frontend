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
            setName(role.name || role.nombre || '');
            setDescription(role.description || role.descripcion || '');
            setSelectedPermissions(role.permissions || []);
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
        <div className="w-full">
            <div className="bg-white rounded-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    {role ? 'Editar Rol' : 'Crear Nuevo Rol'}
                </h3>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Nombre del Rol
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Ej: Administrador, Auditor"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Descripción
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Descripción del rol"
                            rows={3}
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-4">
                            Asignación de Permisos
                        </label>
                        <div className="space-y-3 border border-gray-200 rounded-lg p-4 bg-gray-50">
                            {ALL_MENU_ITEMS.map(item => (
                                <div key={item.id} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id={item.id}
                                        checked={selectedPermissions.includes(item.id)}
                                        onChange={() => handlePermissionChange(item.id)}
                                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
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

                    <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-primary-orange text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:bg-gray-400 disabled:opacity-100"
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
