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
}) => {
  const [showFindingModal, setShowFindingModal] = useState(false);
  const handleEstadoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onEstadoChange(subtarea.id, e.target.value);
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
          <img src="/fiddings.png" alt="Hallazgo" className="w-6 h-6 object-cover invert flex-shrink-0" style={{ objectPosition: 'center' }} />
          Marcar Hallazgo
        </button>
      </td>

      {showFindingModal && (
        <CrearFindingModal
          auditoria={auditoria}
          initialActividadId={subtarea.id}
          onClose={() => setShowFindingModal(false)}
        />
      )}
    </tr>
  );
};
