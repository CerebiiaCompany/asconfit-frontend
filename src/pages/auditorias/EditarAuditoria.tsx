import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Breadcrumb } from "../../components/common/Breadcrumb";
import { CategoriasSection } from "../../components/auditorias/auditorias-nueva/CategoriasSection";
import { FormActions } from "../../components/auditorias/auditorias-nueva/FormActions";
import { useUser } from "../../hooks/useUser";
import { useAuditoriaForm } from "../../hooks/useAuditoriaForm";
import { useAuditoriaValidation } from "../../hooks/useAuditoriaValidation";
import { auditoriaService } from "../../services/auditoriaService";
import { useToast } from "../../contexts/ToastContext";

export const EditarAuditoria: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useUser(() => navigate("/login"));

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  const [auditoria, setAuditoria] = useState<any>(null);
  const [errors, setErrors] = useState<any>({});
  const { addToast } = useToast();

  const {
    formData,
    setFormData,
    categorias,
    handleAddCategoria,
    handleRemoveCategoria,
    handleCategoriaChange,
    handleAddSubtarea,
    handleRemoveSubtarea,
    handleSubtareaChange,
    handleLoadPlantilla,
    handleLoadExistingAuditoriaCategorias,
  } = useAuditoriaForm();

  const handleSubtareaChangeWithValidation = (
    categoriaId: string,
    subtareaId: string,
    field: string,
    value: string,
  ) => {
    handleSubtareaChange(categoriaId, subtareaId, field as any, value);
    // Limpiar error del campo específico cuando se modifica
    const errorKey = `${categoriaId}_${subtareaId}_${field}`;
    if (errors[errorKey]) {
      setErrors((prev: any) => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  const handleCategoriaChangeWithValidation = (
    id: string,
    field: string,
    value: any,
  ) => {
    handleCategoriaChange(id, field as any, value);
    // Limpiar error del campo específico cuando se modifica
    const errorKey = `${id}_${field}`;
    if (errors[errorKey]) {
      setErrors((prev: any) => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  // Cargar auditoría existente
  useEffect(() => {
    const cargarAuditoria = async () => {
      try {
        if (!id || !user) return;

        const data = await auditoriaService.getAuditoria(id);
        setAuditoria(data);

        // Verificar permisos: admin, creador o delegado
        const isAdmin = user?.role?.nombre?.toLowerCase() === 'admin';
        const tienePermiso =
          isAdmin ||
          data.user_id === user.id ||
          data.delegado_1_id === user.id ||
          data.delegado_2_id === user.id;

        if (!tienePermiso) {
          addToast("No tienes permiso para editar esta auditoría", "error");
          setCanEdit(false);
        } else {
          setCanEdit(true);
          // Cargar datos existentes en el formulario
          const formatDateToYYYYMMDD = (dateStr: string | null | undefined) => {
            if (!dateStr) return "";
            const d = new Date(dateStr);
            if (isNaN(d.getTime())) return "";
            const y = d.getFullYear();
            const m = String(d.getMonth() + 1).padStart(2, "0");
            const day = String(d.getDate()).padStart(2, "0");
            return `${y}-${m}-${day}`;
          };
          setFormData((prev) => ({
            ...prev,
            empresa: data.empresa?.razon_social || "",
            nit: data.empresa?.nit || "",
            razonSocial: data.empresa?.razon_social || "",
            direccion: data.empresa?.direccion || "",
            responsable: data.empresa?.representante_legal || "",
            actividadEconomica: data.empresa?.actividad_economica || "",
            contacto: data.empresa?.telefono_empresarial || "",
            pt: data.pt || "",
            tipoAuditoria: data.tipo_auditoria || "",
            fechaInicial: formatDateToYYYYMMDD(data.fecha_inicial),
            fechaCorte: formatDateToYYYYMMDD(data.fecha_corte),
            empresaId: data.empresa_id,
          }));
          // Cargar categorías y subtareas existentes
          if (data.categorias && data.categorias.length > 0) {
            handleLoadExistingAuditoriaCategorias(data.categorias);
          }
        }
      } catch (error: any) {
        console.error("Error al cargar auditoría:", error);
        addToast("No se pudo cargar la auditoría", "error");
      } finally {
        setIsLoading(false);
      }
    };

    cargarAuditoria();
  }, [id, user]);

  const { validateForm } = useAuditoriaValidation();

  const handleSubmit = async () => {
    if (!id || !auditoria) return;

    // Validar campos de categorías y subtareas
    const validationResult = validateForm(formData, categorias, [auditoria?.delegado_1_id, auditoria?.delegado_2_id]);
    
    if (!validationResult.isValid) {
      setErrors(validationResult.errors);
      addToast(validationResult.modalMessage || "Completa todos los campos obligatorios marcados en rojo", "warning");
      return;
    }

    // Validar que al menos tenga una categoría para agregar
    if (categorias.length === 0) {
      addToast("Debes agregar al menos una categoría para actualizar", "warning");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrors({}); // Limpiar errores al enviar
      const updateData = {
        formData,
        categorias,
        searchConcepto: auditoria.search_concepto || "",
      };

      await auditoriaService.updateAuditoria(id, updateData);
      addToast("Auditoría actualizada exitosamente", "success");
      navigate(`/auditorias/${id}`);
    } catch (error: any) {
      console.error("Error al actualizar auditoría:", error);
      addToast(error.response?.data?.message || "Error al actualizar la auditoría", "error");
    } finally {
      setIsSubmitting(false);
    }
  };


  if (isLoading) {
    return (
      <div className="pb-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando auditoría...</p>
        </div>
      </div>
    );
  }

  if (!canEdit) {
    navigate("/auditorias");
    return null;
  }

  const breadcrumbItems = [
    { label: "Auditorías", onClick: () => navigate("/auditorias") },
    {
      label: `Auditoría ${id}`,
      onClick: () => navigate(`/auditorias/${id}`),
    },
    { label: "Agregar categorías", isActive: true },
  ];

  return (
    <div className="pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto pt-8">
        <Breadcrumb items={breadcrumbItems} />

        <div className="mb-8">
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 border-l-4 border-orange-500 p-4 rounded-lg">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Agregar Categorías a Auditoría
            </h1>
            <p className="text-gray-700">
              Puedes agregar las categorías y requerimientos que necesites para
              esta auditoría.
            </p>
            {auditoria && (
              <div className="mt-3 text-sm text-gray-600">
                <p>
                  <strong>Empresa:</strong> {auditoria.empresa?.razon_social}
                </p>
                <p>
                  <strong>Tipo:</strong> {auditoria.tipo_auditoria}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white shadow-xl rounded-2xl p-4 sm:p-6 lg:p-8">
          <CategoriasSection
            categorias={categorias}
            onAddCategoria={handleAddCategoria}
            onRemoveCategoria={handleRemoveCategoria}
            onCategoriaChange={handleCategoriaChangeWithValidation}
            onAddSubtarea={handleAddSubtarea}
            onRemoveSubtarea={handleRemoveSubtarea}
            onSubtareaChange={handleSubtareaChangeWithValidation}
            onLoadPlantilla={handleLoadPlantilla}
            fechaAuditoriaInicio={formData.fechaInicial}
            fechaAuditoriaCorte={formData.fechaCorte}
            auditoriaDelegados={[auditoria?.delegado_1_id, auditoria?.delegado_2_id].filter((id): id is number => id !== null && id !== undefined)}
            errors={errors}
          />

          <FormActions
            onSubmit={handleSubmit}
            submitLabel="Guardar cambios"
            onCancel={() => navigate(`/auditorias/${id}`)}
            isLoading={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
};
