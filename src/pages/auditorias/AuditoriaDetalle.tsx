import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { auditoriaService } from "../../services/auditoriaService";
import { findingService } from "../../services/findingService";
import { Modal } from "../../components/Modal";
import { useUser } from "../../hooks/useUser";
import { useAuditoriaDetalle } from "../../hooks/useAuditoriaDetalle";
import { useFileUpload } from "../../hooks/useFileUpload";
import { AuditoriaInfoCard } from "../../components/auditorias/auditorias-detalle/AuditoriaInfoCard";
import { CategoriaCard } from "../../components/auditorias/auditorias-detalle/CategoriaCard";
import { EstadoBadge } from "../../components/auditorias/EstadoBadge";
import { LoadingState } from "../../components/common/LoadingState";
import { Calendar, CalendarEvent } from "../../components/common/Calendar";

export const AuditoriaDetalle: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useUser(() => navigate("/login"));
  const { auditoria, loading, refetch } = useAuditoriaDetalle(id);
  const [findingsCount, setFindingsCount] = useState<Record<number, number>>({});
  const [updatingEstadoSubtareaId, setUpdatingEstadoSubtareaId] = useState<
    number | null
  >(null);

  // Cargar conteo de findings por subtarea
  useEffect(() => {
    if (!id) return;
    findingService.getByAuditoria(Number(id)).then((findings) => {
      const counts: Record<number, number> = {};
      findings.forEach((f) => {
        const actividadId = f.actividad?.id ?? (f as any).actividad_id;
        if (actividadId) {
          counts[actividadId] = (counts[actividadId] || 0) + 1;
        }
      });
      setFindingsCount(counts);
    }).catch(() => { });
  }, [id]);

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

  const handleFindingCreated = (actividadId: number, newCount: number) => {
    setFindingsCount(prev => ({ ...prev, [actividadId]: newCount }));
  };

  // Verificar si el usuario actual puede editar la auditoría
  const isAdmin = user?.role?.nombre?.toLowerCase() === 'admin';
  const canEdit = user && auditoria && (
    isAdmin ||
    auditoria.user_id === user.id ||
    auditoria.delegado_1_id === user.id ||
    auditoria.delegado_2_id === user.id
  );

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

  // Generar eventos del calendario basados en la auditoría y subtareas
  const calendarEvents: CalendarEvent[] = [];

  // Eventos de la auditoría
  if (auditoria.fecha_inicial) {
    calendarEvents.push({
      date: auditoria.fecha_inicial,
      title: 'Fecha Inicial Auditoría',
      color: 'bg-orange-500'
    });
  }
  if (auditoria.fecha_corte) {
    calendarEvents.push({
      date: auditoria.fecha_corte,
      title: 'Fecha Corte Auditoría',
      color: 'bg-green-500'
    });
  }

  // Eventos de las subtareas (requerimientos)
  auditoria.categorias?.forEach((categoria: any) => {
    categoria.subtareas?.forEach((subtarea: any) => {
      if (subtarea.fecha_solicitud) {
        calendarEvents.push({
          date: subtarea.fecha_solicitud,
          title: `Solicitud: ${subtarea.nombre}`,
          color: 'bg-blue-500'
        });
      }
      if (subtarea.tiempo_entrega) {
        calendarEvents.push({
          date: subtarea.tiempo_entrega,
          title: `Entrega: ${subtarea.nombre}`,
          color: 'bg-purple-500'
        });
      }
    });
  });

  return (
    <div className="py-4 px-3 sm:px-6 lg:px-8 overflow-x-hidden">
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
          <div className="flex items-center gap-4">
            {canEdit && (
              <button
                onClick={() => navigate(`/auditorias/${id}/editar`)}
                className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium text-sm"
              >
                <svg
                  className="h-4 w-4"
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
                Agregar categorías
              </button>
            )}
            <EstadoBadge estado={auditoria.estado} />
          </div>
        </div>

        {/* Layout superior: Información de la Auditoría y Calendario */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Columna izquierda: Información de la Auditoría */}
          <div className="flex-1">
            <AuditoriaInfoCard auditoria={auditoria} />
          </div>

          {/* Columna derecha: Calendario */}
          <div className="lg:w-[280px] flex-shrink-0">
            <div className="sticky top-4">
              <Calendar events={calendarEvents} />
            </div>
          </div>
        </div>

        {/* Categorías y Subtareas - Ancho completo */}
        {auditoria.categorias && auditoria.categorias.length > 0 && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-800">
              Categorías y Requerimientos
            </h3>

            {auditoria.categorias.map((categoria: any) => (
              <CategoriaCard
                key={categoria.id}
                categoria={categoria}
                auditoria={auditoria}
                uploadingSubtareaId={uploadingSubtareaId}
                fileInputRefs={fileInputRefs}
                onFileSelect={handleFileSelect}
                onFileChange={uploadFile}
                onOpenFile={handleOpenFile}
                getAcceptedFileTypes={getAcceptedFileTypes}
                onEstadoChange={handleEstadoChange}
                updatingEstadoSubtareaId={updatingEstadoSubtareaId}
                userRole={user?.role?.nombre || "delegado"}
                findingsCount={findingsCount}
                onFindingCreated={handleFindingCreated}
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
