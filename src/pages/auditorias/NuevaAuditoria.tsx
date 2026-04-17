import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from "../../components/Modal";
import { Breadcrumb } from "../../components/common/Breadcrumb";
import { AuditoriaHeader } from "../../components/auditorias/auditorias-nueva/AuditoriaHeader";
import { EmpresaSection } from "../../components/auditorias/auditorias-nueva/EmpresaSection";
import { PTSection } from "../../components/auditorias/auditorias-nueva/PTSection";
import { TipoAuditoriaSection } from "../../components/auditorias/auditorias-nueva/TipoAuditoriaSection";
import { FechasSection } from "../../components/auditorias/auditorias-nueva/FechasSection";
import { CategoriasSection } from "../../components/auditorias/auditorias-nueva/CategoriasSection";
import { FormActions } from "../../components/auditorias/auditorias-nueva/FormActions";
import { useUser } from "../../hooks/useUser";
import { useAuditoriaForm } from "../../hooks/useAuditoriaForm";
import { useAuditoriaValidation } from "../../hooks/useAuditoriaValidation";
import { auditoriaService } from "../../services/auditoriaService";

export const NuevaAuditoria: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser(() => navigate("/login"));
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
    setFormData,
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

  const handleSelectEmpresa = (empresa: any) => {
    setFormData((prev) => ({
      ...prev,
      empresa: empresa.razon_social || "",
      nit: empresa.nit || "",
      razonSocial: empresa.razon_social || "",
      direccion: empresa.direccion || "",
      responsable: empresa.representante_legal || "",
      actividadEconomica: empresa.actividad_economica || "",
      contacto: empresa.telefono_empresarial || empresa.telefono_personal || "",
      empresaId: empresa.id || null,
    }));
  };

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

  const breadcrumbItems = [
    { label: "Auditorías", onClick: () => navigate("/auditorias") },
    { label: "Crear auditoría", isActive: true },
  ];

  return (
    <div className="pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto pt-8">
          <Breadcrumb items={breadcrumbItems} />

          <AuditoriaHeader
            searchEmpresa={searchEmpresa}
            searchConcepto={searchConcepto}
            onSearchEmpresaChange={setSearchEmpresa}
            onSearchConceptoChange={setSearchConcepto}
            onSelectEmpresa={handleSelectEmpresa}
            onBack={() => navigate("/auditorias")}
          />

          <div className="bg-white shadow-xl rounded-2xl p-4 sm:p-6 lg:p-8">
            <EmpresaSection
              formData={formData}
              onInputChange={handleInputChange}
            />

            <PTSection value={formData.pt} onChange={handleInputChange} />

            <TipoAuditoriaSection value={formData.tipoAuditoria} onChange={handleInputChange} />

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
