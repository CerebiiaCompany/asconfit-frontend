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
      // Si es formato ISO, tomamos solo la parte de la fecha
      if (dateString.includes("T")) {
        return dateString.split("T")[0];
      }
      return dateString;
    } catch {
      return dateString || "-";
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
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-orange-400 text-orange-500 hover:bg-orange-50 text-xs font-medium transition-colors"
          title="Crear hallazgo para esta actividad"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
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
    </tr>
  );
};
