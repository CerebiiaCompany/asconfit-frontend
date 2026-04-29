import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../hooks/useUser";
import { useTareas } from "../hooks/useTareas";
import { useFileUpload } from "../hooks/useFileUpload";
import { AuditoriaCard } from "../components/tareas/AuditoriaCard";
import { TareaCard } from "../components/tareas/TareaCard";
import { EmptyState } from "../components/tareas/EmptyState";
import { LoadingSpinner } from "../components/tareas/LoadingSpinner";
import { Modal } from "../components/Modal";
import { authService } from "../services/authService";

export const MisTareas: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser(() => navigate("/login"));
  const [auditoriaSeleccionada, setAuditoriaSeleccionada] = useState<
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

  const { auditorias, loading, recargar } = useTareas();

  const { uploadFile, uploadingSubtareaId, getAcceptedFileTypes } =
    useFileUpload({
      onSuccess: (fileName) => {
        setModal({
          isOpen: true,
          type: "success",
          title: "¡Éxito!",
          message: `Archivo "${fileName}" subido correctamente`,
        });
        recargar();
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

  const handleFileUpload = async (
    subtareaId: number,
    formatoArchivo: string | null,
    file: File
  ) => {
    await uploadFile(subtareaId, file, formatoArchivo);
  };

  const handleCloseModal = () => {
    setModal({ ...modal, isOpen: false });
  };

  return (
    <div className="pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto pt-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            {auditoriaSeleccionada !== null && (
              <button
                onClick={() => setAuditoriaSeleccionada(null)}
                className="text-orange-500 hover:text-orange-600 transition-colors"
              >
                <svg
                  className="h-6 w-6"
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
              </button>
            )}
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              {auditoriaSeleccionada === null
                ? "Mis Encargos"
                : "Tareas de la Auditoría"}
            </h1>
          </div>
          <p className="text-gray-600">
            {auditoriaSeleccionada === null
              ? "Selecciona una auditoría para ver sus tareas"
              : "Aquí puedes ver y subir archivos para las tareas asignadas"}
          </p>
        </div>

        {/* Lista de Auditorías o Tareas */}
        <div className="bg-white shadow-xl rounded-2xl p-6">
          {loading ? (
            <LoadingSpinner />
          ) : auditoriaSeleccionada === null ? (
            // Vista de lista de auditorías
            auditorias.length === 0 ? (
              <EmptyState
                title="No hay auditorías disponibles"
                description="Las auditorías aparecerán aquí cuando se te asignen"
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {auditorias.map((auditoria) => (
                  <AuditoriaCard
                    key={auditoria.auditoriaId}
                    auditoria={auditoria}
                    onClick={() =>
                      setAuditoriaSeleccionada(auditoria.auditoriaId)
                    }
                  />
                ))}
              </div>
            )
          ) : (
            // Vista de tareas de la auditoría seleccionada
            <div className="space-y-4">
              {auditorias
                .find((a) => a.auditoriaId === auditoriaSeleccionada)
                ?.tareas.map((tarea, index) => (
                  <TareaCard
                    key={`${tarea.subtareaId}-${index}`}
                    tarea={tarea}
                    onFileUpload={(file) =>
                      handleFileUpload(
                        tarea.subtareaId,
                        tarea.formatoArchivo,
                        file
                      )
                    }
                    acceptedFileTypes={getAcceptedFileTypes(
                      tarea.formatoArchivo
                    )}
                    uploading={uploadingSubtareaId === tarea.subtareaId}
                  />
                ))}
            </div>
          )}
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
