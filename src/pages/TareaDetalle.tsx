import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { Modal } from "../components/Modal";
import { LoadingState } from "../components/common/LoadingState";
import { EmptyState } from "../components/common/EmptyState";
import { BreadcrumbTarea } from "../components/tareas/BreadcrumbTarea";
import { InfoEmpresa } from "../components/tareas/InfoEmpresa";
import { CategoriaSection } from "../components/tareas/CategoriaSection";
import { useUser } from "../hooks/useUser";
import { useAuditoria } from "../hooks/useAuditoria";
import { authService } from "../services/authService";

export const TareaDetalle: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useUser(() => navigate("/login"));
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { auditoria, loading, modal, setModal, handleFileUpload } =
    useAuditoria(id);

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleCloseModal = () => {
    setModal({ ...modal, isOpen: false });
  };

  // Loading state
  if (loading) {
    return <LoadingState />;
  }

  // Empty state
  if (!auditoria) {
    return (
      <EmptyState
        message="No se encontró la auditoría"
        buttonText="Volver"
        onButtonClick={() => navigate("/mis-tareas")}
      />
    );
  }

  // Main content
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

      <main className="lg:ml-32 ml-0 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <BreadcrumbTarea
            empresa={auditoria.empresa}
            onNavigateBack={() => navigate("/mis-tareas")}
          />

          <InfoEmpresa auditoria={auditoria} />

          <div className="space-y-6">
            {auditoria.categorias?.map((categoria) => (
              <CategoriaSection
                key={categoria.id}
                categoria={categoria}
                onFileUpload={handleFileUpload}
              />
            ))}
          </div>
        </div>
      </main>

      <Modal
        isOpen={modal.isOpen}
        onClose={handleCloseModal}
        title={modal.title}
        message={modal.message}
        type={modal.type}
      />
    </div>
  );
};
