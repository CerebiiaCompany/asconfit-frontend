import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "../../services/userService";
import { Role, getRoleName } from "../../types/role";
import { SearchInput } from "../SearchInput";
import { storageUrl } from "../../utils/storageUrl";
import { CustomSelect } from "../common/CustomSelect";

interface UserRoleAssignmentProps {
  users: User[];
  roles: Role[];
  loading: boolean;
  onUpdateRole: (userId: number, roleId: string) => Promise<void>;
}

export const UserRoleAssignment: React.FC<UserRoleAssignmentProps> = ({
  users,
  roles,
  loading,
  onUpdateRole,
}) => {
  const navigate = useNavigate();
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleRoleChange = async (userId: number, roleId: string) => {
    setUpdatingId(userId);
    try {
      await onUpdateRole(userId, roleId);
    } finally {
      setUpdatingId(null);
    }
  };

  // Filter users by name or email
  const filteredUsers = users.filter((user) => {
    const searchLower = searchTerm.toLowerCase();
    const name = user.name || "";
    const email = user.email || "";
    return (
      name.toLowerCase().includes(searchLower) ||
      email.toLowerCase().includes(searchLower)
    );
  });

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
    <div>
      {/* Search Input */}
      <div className="mb-4">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Buscar por nombre o correo..."
          className="max-w-md"
        />
      </div>

      {/* Results count */}
      {searchTerm && (
        <div className="mb-3 text-sm text-gray-600">
          Mostrando {filteredUsers.length} de {users.length} usuarios
        </div>
      )}

      {filteredUsers.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No se encontraron usuarios que coincidan con "{searchTerm}"
        </div>
      ) : (
        <div className="overflow-x-auto overflow-y-visible">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Rol Actual
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Asignar Rol
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Hoja de Vida
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {user.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.role_id ? (
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${user.role?.nombre === "admin"
                          ? "bg-purple-100 text-purple-800"
                          : user.role?.nombre === "auditor"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                          }`}
                      >
                        {user.role
                          ? getRoleName(user.role as Role)
                          : `Rol ID: ${user.role_id}`}
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                        Sin rol
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <CustomSelect
                      value={user.role_id || ""}
                      options={[
                        { value: "", label: "Seleccionar rol..." },
                        ...roles
                          .filter((role) => role.id !== undefined)
                          .map((role) => ({
                            value: role.id!,
                            label: getRoleName(role),
                          })),
                      ]}
                      onChange={(value) => {
                        if (value) {
                          handleRoleChange(user.id, value);
                        }
                      }}
                      disabled={updatingId === user.id}
                      placeholder="Seleccionar rol..."
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.cv_path || user.cv_url ? (
                      <a
                        href={storageUrl(user.cv_url ?? user.cv_path) ?? "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#F97316] text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium shadow-sm"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                        Ver CV
                      </a>
                    ) : (
                      <button
                        disabled
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-400 rounded-lg cursor-not-allowed opacity-60 text-sm font-medium"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                          />
                        </svg>
                        Sin CV
                      </button>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => navigate(`/user-stats/${user.id}`)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium shadow-sm"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                      Ver Estadísticas
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
