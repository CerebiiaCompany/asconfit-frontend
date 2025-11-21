import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { useAuth } from "../contexts/AuthContext";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { useUser } from "../hooks/useUser";
import { useRoles } from "../hooks/useRoles";
import { useUsers } from "../hooks/useUsers";
import { useRoleForm } from "../hooks/useRoleForm";
import { useConfirmModal } from "../hooks/useConfirmModal";
import { useTabs } from "../hooks/useTabs";
import { RoleForm } from "../components/Roles/RoleForm";
import { RoleList } from "../components/Roles/RoleList";
import { UserRoleList } from "../components/Users/UserRoleList";
import { Modal } from "../components/Modal";

export const Roles: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser(() => navigate("/login"));
  const { setUser } = useAuth();
  const { roles, loading, error, loadRoles, deleteRole } = useRoles();
  const {
    users,
    loading: usersLoading,
    updateUserRole,
    loadUsers,
  } = useUsers();
  const {
    showForm,
    selectedRole,
    handleCreateNew,
    handleEdit,
    handleFormClose,
  } = useRoleForm();
  const {
    isOpen,
    title,
    message,
    confirmText,
    openConfirm,
    closeConfirm,
    handleConfirm,
  } = useConfirmModal();
  const { activeTab, setActiveTab } = useTabs("users");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    openConfirm(
      "Eliminar Rol",
      "¿Estás seguro de que deseas eliminar este rol?",
      async () => {
        try {
          await deleteRole(id);
        } catch (err) {
          console.error("Delete error:", err);
        }
      },
      "Eliminar"
    );
  };

  const handleFormSubmit = async (success: boolean) => {
    if (success) {
      handleFormClose();
      await loadRoles();
    }
  };

  const handleUpdateUserRole = async (userId: number, roleId: string) => {
    openConfirm(
      "Cambiar Rol",
      "¿Estás seguro de que deseas cambiar el rol de este usuario?",
      async () => {
        try {
          await updateUserRole(userId, parseInt(roleId));
          await loadUsers(); // Reload users to refresh the content
          setSuccessMessage("Rol actualizado correctamente");
          setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err) {
          console.error("Update error:", err);
        }
      },
      "Cambiar"
    );
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header
        userName={user?.name || "Usuario"}
        onLogout={handleLogout}
        onNavigateToSettings={() => navigate("/perfil")}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <Sidebar
        onLogout={handleLogout}
        userRole={(user?.role?.nombre as any) || "delegado"}
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

          {/* Success Message */}
          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6">
              {successMessage}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Tabs */}
          <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
            <div className="border-b border-gray-200">
              <div className="flex">
                <button
                  onClick={() => setActiveTab("users")}
                  className={`px-6 py-4 font-medium transition-colors ${
                    activeTab === "users"
                      ? "text-primary-orange border-b-2 border-primary-orange"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Asignar Roles a Usuarios
                </button>
                <button
                  onClick={() => setActiveTab("roles")}
                  className={`px-6 py-4 font-medium transition-colors ${
                    activeTab === "roles"
                      ? "text-primary-orange border-b-2 border-primary-orange"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Gestión de Roles
                </button>
              </div>
            </div>

            {/* Users Tab */}
            {activeTab === "users" && (
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Asignar Roles a Usuarios
                </h3>
                <UserRoleList
                  users={users}
                  roles={roles}
                  loading={usersLoading || loading}
                  onUpdateRole={handleUpdateUserRole}
                />
              </div>
            )}

            {/* Roles Tab */}
            {activeTab === "roles" && (
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Lista de Roles
                  </h3>
                  {!showForm && (
                    <button
                      onClick={handleCreateNew}
                      className="bg-primary-orange text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity font-medium"
                    >
                      Crear Nuevo Rol
                    </button>
                  )}
                </div>
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
            )}
          </div>
        </div>
      </main>

      {/* Confirmation Modal */}
      <Modal
        isOpen={isOpen}
        onClose={closeConfirm}
        title={title}
        message={message}
        type="warning"
        confirmText={confirmText}
        onConfirm={handleConfirm}
      />
    </div>
  );
};
