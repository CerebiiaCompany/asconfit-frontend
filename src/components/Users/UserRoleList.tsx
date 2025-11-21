import React, { useState } from 'react';
import { User } from '../../services/userService';
import { Role, getRoleName } from '../../types/role';

interface UserRoleListProps {
    users: User[];
    roles: Role[];
    loading: boolean;
    onUpdateRole: (userId: number, roleId: string) => Promise<void>;
}

export const UserRoleList: React.FC<UserRoleListProps> = ({
    users,
    roles,
    loading,
    onUpdateRole,
}) => {
    const [updatingId, setUpdatingId] = useState<number | null>(null);

    const handleRoleChange = async (userId: number, roleId: string) => {
        setUpdatingId(userId);
        try {
            await onUpdateRole(userId, roleId);
        } finally {
            setUpdatingId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-orange"></div>
            </div>
        );
    }

    if (users.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                No hay usuarios disponibles
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                            Nombre
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                            Email
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                            Rol Actual
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                            Asignar Rol
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 text-sm text-gray-900">
                                {user.name}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                                {user.email}
                            </td>
                            <td className="px-6 py-4 text-sm">
                                {user.role_id ? (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                        {user.role ? getRoleName(user.role as Role) : `Rol ID: ${user.role_id}`}
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600">
                                        Sin rol
                                    </span>
                                )}
                            </td>
                            <td className="px-6 py-4 text-sm">
                                <select
                                    value={user.role_id || ''}
                                    onChange={(e) => {
                                        if (e.target.value) {
                                            handleRoleChange(user.id, e.target.value);
                                        }
                                    }}
                                    disabled={updatingId === user.id}
                                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-orange disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <option value="">Seleccionar rol...</option>
                                    {roles.map((role) => (
                                        <option key={role.id} value={role.id}>
                                            {getRoleName(role)}
                                        </option>
                                    ))}
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
