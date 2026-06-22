import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { PriorityBadge } from "../PriorityBadge";
import { EstadoInformacionBadge } from "../EstadoInformacionBadge";
import { FileUploadCell } from "./FileUploadCell";
import { FormatoBadge } from "../FormatoBadge";
import { CrearFindingModal } from "../Findings/CrearFindingModal";
import { notaService } from "../../../services/notaService";

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
  onFindingCreated?: (actividadId: number, count: number) => void;
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
  onFindingCreated,
}) => {
  const [showFindingModal, setShowFindingModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [loadingNote, setLoadingNote] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingEstado, setPendingEstado] = useState<string>("");

  // Determinar si es admin para modo de solo lectura
  const isAdmin = userRole === 'admin';

  // Cargar nota guardada al montar
  useEffect(() => {
    const loadNota = async () => {
      setLoadingNote(true);
      try {
        const data = await notaService.getNota(subtarea.id);
        setNoteText(data.contenido || '');
      } catch (error) {
        console.error('Error al cargar nota:', error);
      } finally {
        setLoadingNote(false);
      }
    };
    loadNota();
  }, [subtarea.id]);

  const handleSaveNote = async () => {
    try {
      await notaService.updateNota(subtarea.id, noteText);
      setShowNoteModal(false);
    } catch (error) {
      console.error('Error al guardar nota:', error);
      alert('Error al guardar la nota');
    }
  };

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
    <>
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
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFindingModal(true)}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-orange-400 text-orange-500 hover:bg-orange-50 text-xs font-medium transition-colors whitespace-nowrap"
              title="Crear hallazgo para esta actividad"
            >
              {findingsCount > 0 && (
                <span className="bg-orange-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {findingsCount}
                </span>
              )}
              Hallazgo
            </button>
            <button
              onClick={() => setShowNoteModal(true)}
              className={`p-1.5 rounded-lg border transition-colors ${noteText ? 'border-orange-400 text-orange-500 bg-orange-50' : 'border-gray-300 text-gray-400 hover:border-orange-300 hover:text-orange-400'}`}
              title={noteText ? "Ver/editar nota" : "Agregar nota"}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            </button>
          </div>
        </td>
      </tr>

      {showFindingModal && createPortal(
        <CrearFindingModal
          auditoria={auditoria}
          initialActividadId={subtarea.id}
          onClose={() => setShowFindingModal(false)}
          onSave={(savedFindings) => {
            setShowFindingModal(false);
            if (onFindingCreated) {
              onFindingCreated(subtarea.id, findingsCount + savedFindings.length);
            }
          }}
        />,
        document.body
      )}

      {showNoteModal && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div>
                <h3 className="text-base font-semibold text-gray-800">Nota de Tarea</h3>
                <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{subtarea.nombre}</p>
              </div>
              <button onClick={() => setShowNoteModal(false)} className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-5">
              <textarea
                autoFocus={!isAdmin}
                value={noteText}
                onChange={e => !isAdmin && setNoteText(e.target.value)}
                placeholder={isAdmin ? "No hay notas para esta tarea" : "Escribe una nota para esta tarea..."}
                className={`w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none resize-none ${isAdmin ? 'bg-gray-50 cursor-default' : 'focus:ring-2 focus:ring-orange-500 focus:border-transparent'}`}
                rows={6}
                readOnly={isAdmin}
              />
              <div className="flex gap-3 mt-4">
                <button onClick={() => setShowNoteModal(false)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">
                  {isAdmin ? 'Cerrar' : 'Cancelar'}
                </button>
                {!isAdmin && (
                  <button onClick={handleSaveNote} className="flex-1 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-semibold">
                    Guardar
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {showConfirmModal && createPortal(
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
        </div>,
        document.body
      )}
    </>
  );
};
