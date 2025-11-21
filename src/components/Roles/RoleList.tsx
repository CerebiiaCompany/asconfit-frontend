import React from 'react';
import { Role } from '../../types/role';
import { ALL_MENU_ITEMS } from '../../config/menuConfig';

interface RoleListProps {
    roles: Role[];
    loading: boolean;
    onEdit: (role: Role) => void;
    onDelete: (id: string) => void;
}

export const RoleList: React.FC<RoleListProps> = ({ roles, loading, onEdit, onDelete }) => {
    const getPermissionLabels = (permissionIds: string[]): string => {
        return permissionIds
            .map(id => ALL_MENU_ITEMS.find(item => item.id === id)?.label)
            .filter(Boolean)
            .join(', ');
    };

    if (loading) {
        return <div className="text-center py-8">Cargando roles...</div>;
    }

    if (roles.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                No hay roles creados aún
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="border border-gray-300 px-4 py-2 text-left">Nombre</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Descripción</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Permisos</th>
                        <th className="border border-gray-300 px-4 py-2 text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {roles.map(role => (
                        <tr key={role.id} className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-4 py-2 font-medium">
                                {role.name}
                            </td>
                            <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">
                                {role.description || '-'}
                            </td>
                            <td className="border border-gray-300 px-4 py-2 text-sm">
                                <div className="flex flex-wrap gap-1">
                                    {role.permissions.map(permId => (
                                        <span
                                            key={permId}
                                            className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                                        >
                                            {ALL_MENU_ITEMS.find(item => item.id === permId)?.label}
                                        </span>
                                    ))}
                                </div>
                            </td>
                            <td className="border border-gray-300 px-4 py-2 text-center">
                                <button
                                    onClick={() => onEdit(role)}
                                    className="text-blue-600 hover:text-blue-800 mr-4"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => role.id && onDelete(role.id.toString())}
                                    className="text-red-600 hover:text-red-800"
                                >
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
