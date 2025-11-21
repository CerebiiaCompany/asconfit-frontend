import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { useUser } from "../hooks/useUser";
import { useUsers } from "../hooks/useUsers";
import { useRoles } from "../hooks/useRoles";
import { useConfirmModal } from "../hooks/useConfirmModal";
import { useToast } from "../hooks/useToast";
import { UserRoleAssignment } from "../components/Users/UserRoleAssignment";
import { Modal } from "../components/Modal";
import { ToastContainer } from "../components/Toast/ToastContainer";

export const UserRoles: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser(() => navigate("/login"));
  const {
    users,
    loading: usersLoading,
    error: usersError,
    updateUserRole,
  } = useUsers();
  const { roles, loading: rolesLoading } = useRoles();
  const { isOpen, title, message, openConfirm, closeConfirm, handleConfirm } =
    useConfirmModal();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { toasts, showSuccess, showError, removeToast } = useToast();

  useEffect(() => {
    if (usersError) {
      showError(usersError);
    }
  }, [usersError, showError]);

  const handleUpdateRole = useCallback(
    async (userId: number, roleId: string) => {
      openConfirm(
        "Cambiar Rol",
        "¿Estás seguro de que deseas cambiar el rol de este usuario?",
        async () => {
          try {
            await updateUserRole(userId, parseInt(roleId));
            showSuccess("Rol actualizado correctamente");
          } catch (err) {
            console.error("Update error:", err);
            showError("Error al actualizar el rol del usuario");
          }
        }
      );
    },
    [openConfirm, updateUserRole, showSuccess, showError]
  );

  const handleLogout = useCallback(async () => {
    try {
      await authService.logout();
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
      navigate("/login");
    }
  }, [navigate]);

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
                Asignar Roles a Usuarios
              </h2>
              <p className="mt-2 text-gray-600">
                Gestiona los roles asignados a cada usuario del sistema
              </p>
            </div>
          </div>

          {/* Error Message */}
          {usersError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
              {usersError}
            </div>
          )}

          {/* Users List */}
          <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Lista de Usuarios
              </h3>
            </div>
            <div className="p-6">
              <UserRoleAssignment
                users={users}
                roles={roles}
                loading={usersLoading || rolesLoading}
                onUpdateRole={handleUpdateRole}
              />
            </div>
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
        confirmText="Cambiar"
        onConfirm={handleConfirm}
      />

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
};
