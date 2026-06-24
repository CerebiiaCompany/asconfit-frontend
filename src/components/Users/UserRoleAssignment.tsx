import React, { useState } from "react";
import { User } from "../../services/userService";
import { Role, getRoleName } from "../../types/role";
import { SearchInput } from "../SearchInput";
import { CustomSelect } from "../common/CustomSelect";
import { UserProfileModal } from "./UserProfileModal";

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
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProfileUserId, setSelectedProfileUserId] = useState<number | null>(null);

  const handleRoleChange = async (userId: number, roleId: string) => {
    setUpdatingId(userId);
    try {
      await onUpdateRole(userId, roleId);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleViewProfile = (userId: number) => {
    setSelectedProfileUserId(userId);
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
                  PERFIL
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
                    <button
                      onClick={() => handleViewProfile(user.id)}
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
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      Ver Perfil
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* User Profile Modal */}
      {selectedProfileUserId && (
        <UserProfileModal
          isOpen={true}
          onClose={() => setSelectedProfileUserId(null)}
          userId={selectedProfileUserId}
        />
      )}
    </div>
  );
};
