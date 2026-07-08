import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../hooks/useUser";
import { useRoles } from "../hooks/useRoles";
import { useUsers } from "../hooks/useUsers";
import { useRoleForm } from "../hooks/useRoleForm";
import { useConfirmModal } from "../hooks/useConfirmModal";
import { useTabs } from "../hooks/useTabs";
import { useToast } from "../contexts/ToastContext";
import { RoleForm } from "../components/Roles/RoleForm";
import { RoleList } from "../components/Roles/RoleList";
import { UserRoleAssignment } from "../components/Users/UserRoleAssignment";
import { DelegadoForm } from "../components/Users/DelegadoForm";
import { Modal } from "../components/Modal";
import { getRoleName } from "../types/role";

export const Roles: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser(() => navigate("/login"));
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
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDelegadoForm, setShowDelegadoForm] = useState(false);
  const { addToast } = useToast();

  const delegadoRole = roles.find(
    (role) => getRoleName(role).toLowerCase() === "delegado",
  );
  const delegadoRoleId = delegadoRole?.id
    ? Number(delegadoRole.id)
    : undefined;

  const handleDelegadoCreated = useCallback(async () => {
    setShowDelegadoForm(false);
    await loadUsers();
  }, [loadUsers]);

  const handleDelete = useCallback(
    (id: string) => {
      openConfirm(
        "Eliminar Rol",
        "¿Estás seguro de que deseas eliminar este rol?",
        async () => {
          try {
            setDeletingId(id);
            await deleteRole(id);
            addToast("Rol eliminado correctamente", "success");
          } catch (err) {
            console.error("Delete error:", err);
            addToast("Error al eliminar el rol", "error");
          } finally {
            setDeletingId(null);
          }
        },
        "Eliminar",
      );
    },
    [openConfirm, deleteRole, addToast],
  );

  const handleFormSubmit = async (success: boolean) => {
    if (success) {
      handleFormClose();
      await loadRoles();
      if (selectedRole && selectedRole.id) {
        addToast("Rol actualizado correctamente", "success");
      } else {
        addToast("Rol creado correctamente", "success");
      }
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
          addToast("Rol actualizado correctamente", "success");
        } catch (err) {
          console.error("Update error:", err);
          addToast("Error al actualizar el rol", "error");
        }
      },
      "Cambiar",
    );
  };

  const handleLogout = useCallback(() => {
    // Logout logic is now in AppLayout
    navigate("/login");
  }, [navigate]);

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        {/* Header Card */}
        <div className="bg-white overflow-hidden shadow-xl rounded-2xl mb-6">
          <div className="bg-white px-6 py-8">
            <h2 className="text-3xl font-bold text-gray-800">
              Roles
            </h2>
            <p className="mt-2 text-gray-600">
              Administra los roles y permisos del sistema
            </p>
          </div>
        </div>

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
                Usuarios
              </button>
              <button
                onClick={() => setActiveTab("roles")}
                className={`px-6 py-4 font-medium transition-colors ${
                  activeTab === "roles"
                    ? "text-primary-orange border-b-2 border-primary-orange"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Roles
              </button>
            </div>
          </div>

          {/* Users Tab */}
          {activeTab === "users" && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Usuarios
                </h3>
                <button
                  onClick={() => setShowDelegadoForm(true)}
                  className="inline-flex items-center gap-2 bg-primary-orange text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity font-medium"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Agregar Delegado
                </button>
              </div>
              <UserRoleAssignment
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
                  deletingId={deletingId}
                />
              )}
            </div>
          )}
        </div>
      </div>

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

      {/* Create Delegado Modal */}
      <Modal
        isOpen={showDelegadoForm}
        onClose={() => setShowDelegadoForm(false)}
        title="Agregar Delegado"
      >
        <DelegadoForm
          roleId={delegadoRoleId}
          onClose={() => setShowDelegadoForm(false)}
          onSuccess={handleDelegadoCreated}
        />
      </Modal>
    </div>
  );
};
