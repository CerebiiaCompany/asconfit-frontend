import React from "react";
import { Role, getRoleName } from "../../types/role";
import { ALL_MENU_ITEMS } from "../../config/menuConfig";

interface RoleListProps {
  roles: Role[];
  loading: boolean;
  onEdit: (role: Role) => void;
  onDelete: (id: string) => void;
  deletingId?: string | null;
}

export const RoleList: React.FC<RoleListProps> = ({
  roles,
  loading,
  onEdit,
  onDelete,
  deletingId: externalDeletingId,
}) => {
  const deletingId = externalDeletingId ?? null;
  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Cargando roles...</p>
      </div>
    );
  }

  if (roles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No hay roles creados aún</p>
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
              Descripción
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
              Permisos
            </th>
            <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {roles.map((role) => (
            <tr key={role.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                {getRoleName(role)}
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {role.description || role.descripcion || "-"}
              </td>
              <td className="px-6 py-4 text-sm">
                <div className="flex flex-wrap gap-2">
                  {(role.permissions || []).map((permId) => (
                    <span
                      key={permId}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {ALL_MENU_ITEMS.find((item) => item.id === permId)?.label}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-6 py-4 text-center text-sm whitespace-nowrap">
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => onEdit(role)}
                    className="text-primary-orange hover:opacity-70 font-medium transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={deletingId !== null}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => {
                      if (role.id) {
                        onDelete(role.id.toString());
                      }
                    }}
                    className="text-red-600 hover:text-red-800 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={deletingId !== null}
                  >
                    {deletingId === role.id?.toString()
                      ? "Eliminando..."
                      : "Eliminar"}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
