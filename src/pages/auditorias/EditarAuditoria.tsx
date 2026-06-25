import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Modal } from "../../components/Modal";
import { Breadcrumb } from "../../components/common/Breadcrumb";
import { CategoriasSection } from "../../components/auditorias/auditorias-nueva/CategoriasSection";
import { FormActions } from "../../components/auditorias/auditorias-nueva/FormActions";
import { useUser } from "../../hooks/useUser";
import { useAuditoriaForm } from "../../hooks/useAuditoriaForm";
import { useAuditoriaValidation } from "../../hooks/useAuditoriaValidation";
import { auditoriaService } from "../../services/auditoriaService";

export const EditarAuditoria: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useUser(() => navigate("/login"));

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  const [auditoria, setAuditoria] = useState<any>(null);

  const [modal, setModal] = useState<{
    isOpen: boolean;
    type: "success" | "error" | "warning";
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
    handleAddCategoria,
    handleRemoveCategoria,
    handleCategoriaChange,
    handleAddSubtarea,
    handleRemoveSubtarea,
    handleSubtareaChange,
    handleLoadPlantilla,
    handleLoadExistingAuditoriaCategorias,
  } = useAuditoriaForm();

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
          setModal({
            isOpen: true,
            type: "error",
            title: "Acceso denegado",
            message: "No tienes permiso para editar esta auditoría",
          });
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
        setModal({
          isOpen: true,
          type: "error",
          title: "Error",
          message: "No se pudo cargar la auditoría",
        });
      } finally {
        setIsLoading(false);
      }
    };

    cargarAuditoria();
  }, [id, user]);

  const { validateForm } = useAuditoriaValidation();

  const handleSubmit = async () => {
    if (!id || !auditoria) return;

    // Validar que al menos tenga una categoría para agregar
    if (categorias.length === 0) {
      setModal({
        isOpen: true,
        type: "warning",
        title: "Sin cambios",
        message: "Debes agregar al menos una categoría para actualizar",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const updateData = {
        formData,
        categorias,
        searchConcepto: auditoria.search_concepto || "",
      };

      await auditoriaService.updateAuditoria(id, updateData);
      setModal({
        isOpen: true,
        type: "success",
        title: "¡Éxito!",
        message: "Auditoría actualizada exitosamente",
      });
    } catch (error: any) {
      console.error("Error al actualizar auditoría:", error);
      setModal({
        isOpen: true,
        type: "error",
        title: "Error",
        message:
          error.response?.data?.message || "Error al actualizar la auditoría",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setModal({ ...modal, isOpen: false });
    if (modal.type === "success") {
      navigate(`/auditorias/${id}`);
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
    return (
      <div className="pb-12 px-4 sm:px-6 lg:px-8">
        <Modal
          isOpen={modal.isOpen}
          onClose={() => {
            setModal({ ...modal, isOpen: false });
            navigate("/auditorias");
          }}
          title={modal.title}
          message={modal.message}
          type={modal.type}
        />
      </div>
    );
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
            submitLabel="Guardar cambios"
            onCancel={() => navigate(`/auditorias/${id}`)}
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
