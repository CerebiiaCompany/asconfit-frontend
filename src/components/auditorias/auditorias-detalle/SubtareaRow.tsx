import React, { useState } from "react";
import { PriorityBadge } from "../PriorityBadge";
import { EstadoInformacionBadge } from "../EstadoInformacionBadge";
import { FileUploadCell } from "./FileUploadCell";
import { FormatoBadge } from "../FormatoBadge";
import { CrearFindingModal } from "../Findings/CrearFindingModal";

interface SubtareaRowProps {
  subtarea: any;
  auditoria: any;
  isUploading: boolean;
  fileInputRef: (el: HTMLInputElement | null) => void;
  onFileSelect: (subtareaId: number) => void;
  onFileChange: (
    event: React.ChangeEvent<HTMLInputElement>,
    subtareaId: number
  ) => void;
  onOpenFile: (subtareaId: number, fileName: string) => void;
  getAcceptedFileTypes: (formatoArchivo: string) => string;
  onEstadoChange: (subtareaId: number, estado: string) => void;
  isUpdatingEstado: boolean;
  userRole: string;
  findingsCount?: number;
}

export const SubtareaRow: React.FC<SubtareaRowProps> = ({
  subtarea,
  auditoria,
  isUploading,
  fileInputRef,
  onFileSelect,
  onFileChange,
  onOpenFile,
  getAcceptedFileTypes,
  onEstadoChange,
  isUpdatingEstado,
  userRole,
  findingsCount = 0,
}) => {
  const [showFindingModal, setShowFindingModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingEstado, setPendingEstado] = useState<string>("");

  const handleEstadoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newEstado = e.target.value;
    const currentEstado = subtarea.estado_informacion || "pendiente";

    // Si el estado no cambió, no hacer nada
    if (newEstado === currentEstado) return;

    // Guardar el nuevo estado y mostrar confirmación
    setPendingEstado(newEstado);
    setShowConfirmModal(true);

    // Revertir el select al valor actual
    e.target.value = currentEstado;
  };

  const confirmEstadoChange = () => {
    onEstadoChange(subtarea.id, pendingEstado);
    setShowConfirmModal(false);
    setPendingEstado("");
  };

  const cancelEstadoChange = () => {
    setShowConfirmModal(false);
    setPendingEstado("");
  };

  const getEstadoLabel = (estado: string) => {
    const labels: Record<string, string> = {
      pendiente: "Pendiente",
      aprobado: "Aprobado",
      rechazado: "Rechazado",
    };
    return labels[estado] || estado;
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return "-";
    try {
      // Manejar formato ISO con zona horaria
      let date: Date;
      if (dateString.includes("T")) {
        // Formato ISO: 2025-11-17T00:00:00.000000Z
        date = new Date(dateString);
      } else {
        // Formato simple: 2025-11-17
        date = new Date(dateString + "T00:00:00");
      }

      if (isNaN(date.getTime())) return "-";

      const day = date.getUTCDate();
      const monthNames = [
        "ene",
        "feb",
        "mar",
        "abr",
        "may",
        "jun",
        "jul",
        "ago",
        "sep",
        "oct",
        "nov",
        "dic",
      ];
      const month = monthNames[date.getUTCMonth()];
      const year = date.getUTCFullYear();

      return `${day} ${month} ${year}`;
    } catch {
      return "-";
    }
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-3 py-3">
        <div className="text-sm text-gray-900 font-medium break-words">
          {subtarea.nombre}
        </div>
        {subtarea.observaciones && (
          <div className="text-xs text-gray-500 mt-1 break-words">
            {subtarea.observaciones}
          </div>
        )}
      </td>
      <td className="px-2 py-3 whitespace-nowrap">
        <PriorityBadge prioridad={subtarea.prioridad} />
      </td>
      <td className="px-2 py-3 whitespace-nowrap text-xs text-gray-900">
        {formatDate(subtarea.fecha_solicitud)}
      </td>
      <td className="px-2 py-3 whitespace-nowrap text-xs text-gray-900">
        {formatDate(subtarea.tiempo_entrega)}
      </td>
      <td className="px-2 py-3 whitespace-nowrap">
        {userRole === "auditor" || userRole === "admin" ? (
          <select
            value={subtarea.estado_informacion || "pendiente"}
            onChange={handleEstadoChange}
            disabled={isUpdatingEstado}
            className="text-xs px-2 py-1 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="pendiente">Pendiente</option>
            <option value="aprobado">Aprobado</option>
            <option value="rechazado">Rechazado</option>
          </select>
        ) : (
          <EstadoInformacionBadge estado={subtarea.estado_informacion} />
        )}
      </td>
      <td className="px-3 py-3">
        <FileUploadCell
          subtareaId={subtarea.id}
          archivoNombre={subtarea.archivo_nombre}
          formatoArchivo={subtarea.formato_archivo}
          isUploading={isUploading}
          fileInputRef={fileInputRef}
          onFileSelect={onFileSelect}
          onFileChange={onFileChange}
          onOpenFile={onOpenFile}
          getAcceptedFileTypes={getAcceptedFileTypes}
        />
      </td>
      <td className="px-2 py-3 whitespace-nowrap">
        <FormatoBadge formato={subtarea.formato_archivo} />
      </td>
      <td className="px-2 py-3 whitespace-nowrap">
        <button
          onClick={() => setShowFindingModal(true)}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg border border-orange-400 text-orange-500 hover:bg-orange-50 text-xs font-medium transition-colors whitespace-nowrap"
          title="Crear hallazgo para esta actividad"
        >
          {findingsCount > 0 && (
            <span className="bg-orange-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
              {findingsCount}
            </span>
          )}
          Hallazgo
        </button>
      </td>

      {showFindingModal && (
        <CrearFindingModal
          auditoria={auditoria}
          initialActividadId={subtarea.id}
          onClose={() => setShowFindingModal(false)}
        />
      )}

      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Confirmar cambio de estado
            </h3>
            <p className="text-gray-600 mb-6">
              ¿Está seguro de cambiar el estado de "{subtarea.nombre}" a{" "}
              <span className="font-semibold">{getEstadoLabel(pendingEstado)}</span>?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={cancelEstadoChange}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmEstadoChange}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </tr>
  );
};
