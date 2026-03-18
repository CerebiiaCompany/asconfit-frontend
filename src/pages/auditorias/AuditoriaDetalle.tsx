import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { auditoriaService } from "../../services/auditoriaService";
import { Modal } from "../../components/Modal";
import { useUser } from "../../hooks/useUser";
import { useAuditoriaDetalle } from "../../hooks/useAuditoriaDetalle";
import { useFileUpload } from "../../hooks/useFileUpload";
import { AuditoriaInfoCard } from "../../components/auditorias/auditorias-detalle/AuditoriaInfoCard";
import { CategoriaCard } from "../../components/auditorias/auditorias-detalle/CategoriaCard";
import { EstadoBadge } from "../../components/auditorias/EstadoBadge";
import { LoadingState } from "../../components/common/LoadingState";

export const AuditoriaDetalle: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useUser(() => navigate("/login"));
  const { auditoria, loading, refetch } = useAuditoriaDetalle(id);
  const [updatingEstadoSubtareaId, setUpdatingEstadoSubtareaId] = useState<
    number | null
  >(null);
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
    uploadingSubtareaId,
    fileInputRefs,
    getAcceptedFileTypes,
    handleFileSelect,
    handleFileChange: uploadFile,
    handleOpenFile,
  } = useFileUpload({
    onSuccess: async () => {
      setModal({
        isOpen: true,
        type: "success",
        title: "Éxito",
        message: "Archivo subido exitosamente",
      });
      await refetch();
    },
    onError: (message) => {
      setModal({
        isOpen: true,
        type: "error",
        title: "Error",
        message,
      });
    },
  });

  const handleEstadoChange = async (subtareaId: number, estado: string) => {
    try {
      setUpdatingEstadoSubtareaId(subtareaId);
      await auditoriaService.updateEstadoSubtarea(subtareaId, estado);
      await refetch();
      setModal({
        isOpen: true,
        type: "success",
        title: "Éxito",
        message: "Estado actualizado correctamente",
      });
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      setModal({
        isOpen: true,
        type: "error",
        title: "Error",
        message: "No se pudo actualizar el estado",
      });
    } finally {
      setUpdatingEstadoSubtareaId(null);
    }
  };

  if (loading) {
    return <LoadingState message="Cargando auditoría..." />;
  }

  if (!auditoria) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-5rem)]">
        <div className="text-center">
          <p className="text-gray-500 mb-4">No se encontró la auditoría</p>
          <button
            onClick={() => navigate("/auditorias")}
            className="text-blue-600 hover:text-blue-800"
          >
            Volver a auditorías
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4 px-3 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigate("/auditorias")}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <svg
              className="h-5 w-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Volver a auditorías
          </button>
          <EstadoBadge estado={auditoria.estado} />
        </div>

        {/* Información de la Auditoría */}
        <AuditoriaInfoCard auditoria={auditoria} />

        {/* Categorías y Subtareas */}
        {auditoria.categorias && auditoria.categorias.length > 0 && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-800">
              Categorías y Requerimientos
            </h3>

            {auditoria.categorias.map((categoria: any) => (
              <CategoriaCard
                key={categoria.id}
                categoria={categoria}
                uploadingSubtareaId={uploadingSubtareaId}
                fileInputRefs={fileInputRefs}
                onFileSelect={handleFileSelect}
                onFileChange={uploadFile}
                onOpenFile={handleOpenFile}
                getAcceptedFileTypes={getAcceptedFileTypes}
                onEstadoChange={handleEstadoChange}
                updatingEstadoSubtareaId={updatingEstadoSubtareaId}
                userRole={user?.role?.nombre || "delegado"}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={modal.isOpen}
        onClose={() => setModal({ ...modal, isOpen: false })}
        title={modal.title}
        message={modal.message}
        type={modal.type}
      />
    </div>
  );
};
