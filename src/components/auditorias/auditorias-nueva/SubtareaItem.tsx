import React from "react";
import { Subtarea } from "../../../types/auditoria.types";
import { DatePicker } from "../../common/DatePicker";

interface SubtareaItemProps {
  subtarea: Subtarea;
  onRemove: () => void;
  onChange: (field: keyof Subtarea, value: string) => void;
  fechaAuditoriaInicio: string;
  fechaAuditoriaCorte: string;
}

export const SubtareaItem: React.FC<SubtareaItemProps> = ({
  subtarea,
  onRemove,
  onChange,
  fechaAuditoriaInicio,
  fechaAuditoriaCorte,
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 mb-4">
      {/* Nombre de la subtarea */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nombre del requerimiento
        </label>
        <textarea
          value={subtarea.nombre}
          onChange={(e) => onChange("nombre", e.target.value)}
          rows={2}
          className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-[#F3F3F3] text-sm sm:text-base"
          placeholder="Descripción del requerimiento..."
        />
      </div>

      {/* Prioridad, Fecha y Tiempo */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm text-gray-600 mb-2">Prioridad</label>
          <select
            value={subtarea.prioridad}
            onChange={(e) => onChange("prioridad", e.target.value)}
            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-[#F3F3F3] text-sm sm:text-base"
          >
            <option value="">Seleccionar</option>
            <option value="alta">Alta</option>
            <option value="media">Media</option>
            <option value="baja">Baja</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-2">
            Fecha de solicitud
          </label>
          <DatePicker
            value={subtarea.fechaSolicitud}
            disabled={!fechaAuditoriaInicio || !fechaAuditoriaCorte}
            onChange={(val) => {
              onChange("fechaSolicitud", val);
              if (subtarea.tiempoEntrega && val && subtarea.tiempoEntrega < val) {
                onChange("tiempoEntrega", "");
              }
            }}
            min={fechaAuditoriaInicio}
            max={subtarea.tiempoEntrega || fechaAuditoriaCorte}
            placeholder={!fechaAuditoriaInicio || !fechaAuditoriaCorte ? "Define fechas de auditoría" : "dd/mm/aaaa"}
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-2">
            Fecha de entrega
          </label>
          <DatePicker
            value={subtarea.tiempoEntrega}
            disabled={!fechaAuditoriaInicio || !fechaAuditoriaCorte}
            onChange={(val) => onChange("tiempoEntrega", val)}
            min={subtarea.fechaSolicitud || fechaAuditoriaInicio}
            max={fechaAuditoriaCorte}
            placeholder={!fechaAuditoriaInicio || !fechaAuditoriaCorte ? "Define fechas de auditoría" : "dd/mm/aaaa"}
          />
        </div>
      </div>

      {/* Observaciones */}
      <div className="mb-4">
        <label className="block text-sm text-gray-600 mb-2">
          Observaciones
        </label>
        <textarea
          value={subtarea.observaciones}
          onChange={(e) => onChange("observaciones", e.target.value)}
          rows={2}
          className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-[#F3F3F3] text-sm sm:text-base"
          placeholder="Observaciones adicionales..."
        />
      </div>

      {/* Formato y Subir Archivo */}
      <div className="mt-4 flex flex-col sm:flex-row gap-4 items-start sm:items-end">
        <div className="flex-1">
          <label className="block text-sm text-gray-600 mb-2">
            Formato de archivo
          </label>
          <select
            value={subtarea.formatoArchivo}
            onChange={(e) => onChange("formatoArchivo", e.target.value)}
            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-[#F3F3F3] text-sm sm:text-base"
          >
            <option value="">Seleccionar formato</option>
            <option value="pdf">PDF</option>
            <option value="excel">Excel</option>
            <option value="word">Word</option>
          </select>
        </div>
        <div className="flex-1">
          <span className="text-sm text-gray-600 block mb-2">
            {subtarea.archivoNombre || "Sin adjunto"}
          </span>
          <button
            type="button"
            disabled={!subtarea.formatoArchivo}
            className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base flex items-center justify-center gap-2"
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
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            Subir archivo
          </button>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="p-2 text-white bg-red-500 hover:bg-red-600 rounded-full transition-colors flex-shrink-0"
          title="Eliminar requerimiento"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};
