import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";
import { Modal } from "../../components/Modal";
import { Breadcrumb } from "../../components/common/Breadcrumb";
import { AuditoriaHeader } from "../../components/auditorias/auditorias-nueva/AuditoriaHeader";
import { EmpresaSection } from "../../components/auditorias/auditorias-nueva/EmpresaSection";
import { DelegadoSection } from "../../components/auditorias/auditorias-nueva/DelegadoSection";
import { PTSection } from "../../components/auditorias/auditorias-nueva/PTSection";
import { FechasSection } from "../../components/auditorias/auditorias-nueva/FechasSection";
import { CategoriasSection } from "../../components/auditorias/auditorias-nueva/CategoriasSection";
import { FormActions } from "../../components/auditorias/auditorias-nueva/FormActions";
import { useUser } from "../../hooks/useUser";
import { useAuditoriaForm } from "../../hooks/useAuditoriaForm";
import { useAuditoriaValidation } from "../../hooks/useAuditoriaValidation";
import { authService } from "../../services/authService";
import { auditoriaService } from "../../services/auditoriaService";

export const NuevaAuditoria: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser(() => navigate("/login"));
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchEmpresa, setSearchEmpresa] = useState("");
  const [searchConcepto, setSearchConcepto] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modal, setModal] = useState<{
    isOpen: boolean;
    type: "success" | "error";
    title: string;
    message: string;
  }>({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
  });

  const {
    formData,
    categorias,
    handleInputChange,
    handleAddCategoria,
    handleRemoveCategoria,
    handleCategoriaChange,
    handleAddSubtarea,
    handleRemoveSubtarea,
    handleSubtareaChange,
    handleLoadPlantilla,
  } = useAuditoriaForm();

  const { validateForm } = useAuditoriaValidation();

  const handleSubmit = async () => {
    // Validar formulario
    const validation = validateForm(formData, categorias);
    if (!validation.isValid) {
      setModal({
        isOpen: true,
        type: "error",
        title: "Campos incompletos",
        message: validation.message,
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const auditoriaData = {
        formData,
        categorias,
        searchConcepto,
      };

      await auditoriaService.createAuditoria(auditoriaData);
      setModal({
        isOpen: true,
        type: "success",
        title: "¡Éxito!",
        message: "Auditoría guardada exitosamente",
      });
    } catch (error: any) {
      console.error("Error al guardar auditoría:", error);
      setModal({
        isOpen: true,
        type: "error",
        title: "Error",
        message:
          error.response?.data?.message || "Error al guardar la auditoría",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setModal({ ...modal, isOpen: false });
    if (modal.type === "success") {
      navigate("/auditorias");
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const breadcrumbItems = [
    { label: "Auditorías", onClick: () => navigate("/auditorias") },
    { label: "Crear auditoría", isActive: true },
  ];

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
          <Breadcrumb items={breadcrumbItems} />

          <AuditoriaHeader
            searchEmpresa={searchEmpresa}
            searchConcepto={searchConcepto}
            onSearchEmpresaChange={setSearchEmpresa}
            onSearchConceptoChange={setSearchConcepto}
            onBack={() => navigate("/auditorias")}
          />

          <div className="bg-white shadow-xl rounded-2xl p-4 sm:p-6 lg:p-8">
            <EmpresaSection
              formData={formData}
              onInputChange={handleInputChange}
            />

            <DelegadoSection
              selectedDelegadoId={formData.delegadoId}
              onDelegadoChange={(delegadoId) =>
                handleInputChange({
                  target: { name: "delegadoId", value: delegadoId },
                } as any)
              }
            />

            <PTSection value={formData.pt} onChange={handleInputChange} />

            <FechasSection
              fechaInicial={formData.fechaInicial}
              fechaCorte={formData.fechaCorte}
              onInputChange={handleInputChange}
            />

            <CategoriasSection
              categorias={categorias}
              onAddCategoria={handleAddCategoria}
              onRemoveCategoria={handleRemoveCategoria}
              onCategoriaChange={handleCategoriaChange}
              onAddSubtarea={handleAddSubtarea}
              onRemoveSubtarea={handleRemoveSubtarea}
              onSubtareaChange={handleSubtareaChange}
              onLoadPlantilla={handleLoadPlantilla}
              fechaAuditoriaInicio={formData.fechaInicial}
              fechaAuditoriaCorte={formData.fechaCorte}
            />

            <FormActions
              onSubmit={handleSubmit}
              submitLabel="Guardar auditoría"
              isLoading={isSubmitting}
            />
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
