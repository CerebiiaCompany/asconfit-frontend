import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from "../../components/Modal";
import { Breadcrumb } from "../../components/common/Breadcrumb";
import { AuditoriaHeader } from "../../components/auditorias/auditorias-nueva/AuditoriaHeader";
import { EmpresaSection } from "../../components/auditorias/auditorias-nueva/EmpresaSection";
import { PTSection } from "../../components/auditorias/auditorias-nueva/PTSection";
import { TipoAuditoriaSection } from "../../components/auditorias/auditorias-nueva/TipoAuditoriaSection";
import { FechasSection } from "../../components/auditorias/auditorias-nueva/FechasSection";
import { DelegadosSection } from "../../components/auditorias/auditorias-nueva/DelegadosSection";
import { CategoriasSection } from "../../components/auditorias/auditorias-nueva/CategoriasSection";
import { FormActions } from "../../components/auditorias/auditorias-nueva/FormActions";
import { useUser } from "../../hooks/useUser";
import { useAuditoriaForm } from "../../hooks/useAuditoriaForm";
import { useAuditoriaValidation, AuditoriaErrors } from "../../hooks/useAuditoriaValidation";
import { auditoriaService } from "../../services/auditoriaService";

export const NuevaAuditoria: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser(() => navigate("/login"));
  const [searchEmpresa, setSearchEmpresa] = useState("");
  const [searchConcepto, setSearchConcepto] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<AuditoriaErrors>({});
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
    delegados,
    handleInputChange,
    handleAddCategoria,
    handleRemoveCategoria,
    handleCategoriaChange,
    handleDelegateChange,
    handleAddSubtarea,
    handleRemoveSubtarea,
    handleSubtareaChange,
    handleLoadPlantilla,
  } = useAuditoriaForm();

  const { validateForm } = useAuditoriaValidation();

  // Limpia el error del campo cuando el usuario lo modifica
  const handleInputChangeWithClear = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name } = e.target;
    if (fieldErrors[name as keyof AuditoriaErrors]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name as keyof AuditoriaErrors];
        return next;
      });
    }
    handleInputChange(e);
  };

  const handleDelegateChangeWithClear = (index: number, value: number | null) => {
    if (index === 0 && fieldErrors.delegado0) {
      setFieldErrors((prev) => { const n = { ...prev }; delete n.delegado0; return n; });
    }
    handleDelegateChange(index, value);
  };

  const handleSelectEmpresa = (empresa: any) => {
    // Al seleccionar empresa, limpiar errores de todos los campos de empresa
    setFieldErrors((prev) => {
      const n = { ...prev };
      delete n.empresa; delete n.nit; delete n.razonSocial;
      delete n.direccion; delete n.responsable; delete n.actividadEconomica;
      delete n.contacto;
      return n;
    });
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

  const handleSubmit = async () => {
    const validation = validateForm(formData, categorias, delegados);

    // Siempre actualizar errores de campo (incluso si hay error de categoría)
    setFieldErrors(validation.errors);

    if (!validation.isValid) {
      // Si hay errores en campos básicos, hacer scroll al primero visible
      const hasFieldErrors = Object.keys(validation.errors).length > 0;
      if (hasFieldErrors) {
        // Scroll suave hacia arriba para que el usuario vea los campos en rojo
        window.scrollTo({ top: 0, behavior: "smooth" });
      }

      // Si el error es de categoría/subtarea, mostrar modal
      if (validation.modalMessage) {
        setModal({
          isOpen: true,
          type: "error",
          title: "Campos incompletos",
          message: validation.modalMessage,
        });
      } else {
        // Error sólo de campos, mostrar toast breve en modal
        setModal({
          isOpen: true,
          type: "error",
          title: "Campos incompletos",
          message: "Completa todos los campos obligatorios marcados en rojo antes de continuar.",
        });
      }
      return;
    }

    try {
      setIsSubmitting(true);
      const auditoriaData = {
        formData,
        categorias,
        searchConcepto,
        delegados: delegados.filter((item): item is number => item !== null),
      };

      await auditoriaService.createAuditoria(auditoriaData);
      setFieldErrors({});
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
            onInputChange={handleInputChangeWithClear}
            errors={fieldErrors}
          />

          <PTSection
            value={formData.pt}
            onChange={handleInputChangeWithClear}
          />

          <TipoAuditoriaSection
            value={formData.tipoAuditoria}
            onChange={handleInputChangeWithClear}
            errors={fieldErrors}
          />

          <FechasSection
            fechaInicial={formData.fechaInicial}
            fechaCorte={formData.fechaCorte}
            onInputChange={handleInputChangeWithClear}
            onFechaInicialChange={(val) => {
              setFieldErrors((prev) => { const n = { ...prev }; delete n.fechaInicial; return n; });
              handleInputChange({ target: { name: "fechaInicial", value: val } } as any);
            }}
            onFechaCorteChange={(val) => {
              setFieldErrors((prev) => { const n = { ...prev }; delete n.fechaCorte; return n; });
              handleInputChange({ target: { name: "fechaCorte", value: val } } as any);
            }}
            errors={fieldErrors}
          />

          <DelegadosSection
            selectedDelegados={delegados}
            onDelegateChange={handleDelegateChangeWithClear}
            errors={fieldErrors}
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
            auditoriaDelegados={delegados.filter((item): item is number => item !== null)}
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
