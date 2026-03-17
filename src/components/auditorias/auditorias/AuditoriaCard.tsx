import React from "react";
import { Auditoria } from "../../../types/auditoria";

interface AuditoriaCardProps {
  auditoria: Auditoria;
  onViewComplete: (id: number) => void;
}

export const AuditoriaCard: React.FC<AuditoriaCardProps> = ({
  auditoria,
  onViewComplete,
}) => {
  // Formatear fecha
  const formatDate = (dateString?: string): string => {
    if (!dateString) return "Planeación";

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

      if (isNaN(date.getTime())) return "Planeación";

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

      return `${day} ${month}`;
    } catch {
      return "Planeación";
    }
  };

  // Calcular porcentajes de progreso basados en subtareas
  const calculateProgress = () => {
    if (!auditoria.categorias || auditoria.categorias.length === 0) {
      return {
        na: 0,
        check: 0,
        pendiente: 0,
        enProceso: 0,
        total: 0,
      };
    }

    // Obtener todas las subtareas
    const allSubtareas = auditoria.categorias.flatMap(
      (cat) => cat.subtareas || []
    );
    const totalSubtareas = allSubtareas.length;

    if (totalSubtareas === 0) {
      return {
        na: 0,
        check: 0,
        pendiente: 0,
        enProceso: 0,
        total: 0,
      };
    }

    // Contar subtareas por estado
    const sinArchivo = allSubtareas.filter((s) => !s.archivo_nombre).length;
    const aprobadas = allSubtareas.filter(
      (s) => s.estado_informacion === "aprobado"
    ).length;
    const pendientes = allSubtareas.filter(
      (s) =>
        s.estado_informacion === "pendiente" ||
        (!s.estado_informacion && s.archivo_nombre)
    ).length;
    const enProceso = allSubtareas.filter(
      (s) =>
        s.estado_informacion === "recibido" ||
        s.estado_informacion === "revision"
    ).length;
    const conArchivo = allSubtareas.filter((s) => s.archivo_nombre).length;

    return {
      na: (sinArchivo / totalSubtareas) * 100,
      check: (aprobadas / totalSubtareas) * 100,
      pendiente: (pendientes / totalSubtareas) * 100,
      enProceso: (enProceso / totalSubtareas) * 100,
      total: (conArchivo / totalSubtareas) * 100,
    };
  };

  const progress = calculateProgress();

  const checkPct = progress.check;
  const pendientePct = 100 - progress.check;

  const getEstadoBadge = (estado: Auditoria["estado"]) => {
    const badges: Record<string, string> = {
      pendiente: "text-red-500",
      check: "text-green-600",
    };
    const labels: Record<string, string> = {
      pendiente: "Pendiente",
      check: "Check",
    };
    return (
      <span className={`font-medium ${badges[estado] ?? "text-gray-600"}`}>
        {labels[estado] ?? estado}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-4 sm:p-6">
      {/* Mobile Layout */}
      <div className="lg:hidden">
        <div className="flex items-start gap-3 mb-3">
          {/* Radio button */}
          <input
            type="radio"
            name="auditoria-select"
            className="w-5 h-5 mt-1 text-orange-500 focus:ring-orange-500"
          />

          <div className="flex-1 space-y-2">
            {/* NIT y Razón Social */}
            <div>
              <div className="text-xs text-gray-500">NIT</div>
              <div className="text-sm font-medium text-gray-900">
                {auditoria.nit || "-"}
              </div>
            </div>

            <div>
              <div className="text-xs text-gray-500">Razón social</div>
              <div className="text-sm font-medium text-gray-900">
                {auditoria.razon_social || auditoria.empresa || "-"}
              </div>
            </div>

            {/* Fecha y Estado */}
            <div className="flex gap-4">
              <div>
                <div className="text-xs text-gray-500">Visita de:</div>
                <div className="text-sm font-medium text-gray-900">
                  {formatDate(auditoria.fecha_inicial || auditoria.fecha_corte)}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Corte</div>
                <div className="text-sm">
                  {getEstadoBadge(auditoria.estado)}
                </div>
              </div>
            </div>

            {/* Proceso - Compact version */}
            <div>
              <div className="text-xs text-gray-500 mb-2">Proceso</div>
              {/* Progress bar */}
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-2">
                <div
                  className="h-full bg-green-500 rounded-full transition-all duration-300"
                  style={{ width: `${checkPct}%` }}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-xs text-gray-500">Check</span>
                  <span className="text-xs font-semibold text-gray-800">{checkPct.toFixed(0)}%</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-400" />
                  <span className="text-xs text-gray-500">Pendiente</span>
                  <span className="text-xs font-semibold text-gray-800">{pendientePct.toFixed(0)}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Button */}
        <button
          onClick={() => onViewComplete(auditoria.id)}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
        >
          Ver auditoría completa
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <div className="grid grid-cols-12 gap-4 items-center">
          {/* Radio button */}
          <div className="col-span-1 flex items-center justify-center">
            <input
              type="radio"
              name="auditoria-select"
              className="w-5 h-5 text-orange-500 focus:ring-orange-500"
            />
          </div>

          {/* NIT */}
          <div className="col-span-2">
            <div className="text-xs text-gray-500 mb-1">NIT</div>
            <div className="text-sm font-medium text-gray-900">
              {auditoria.nit || "-"}
            </div>
          </div>

          {/* Razón Social */}
          <div className="col-span-2">
            <div className="text-xs text-gray-500 mb-1">Razón social</div>
            <div className="text-sm font-medium text-gray-900">
              {auditoria.razon_social || auditoria.empresa || "-"}
            </div>
          </div>

          {/* Visita de */}
          <div className="col-span-2">
            <div className="text-xs text-gray-500 mb-1">Visita de:</div>
            <div className="text-sm font-medium text-gray-900">
              {formatDate(auditoria.fecha_inicial || auditoria.fecha_corte)}
            </div>
          </div>

          {/* Corte */}
          <div className="col-span-2">
            <div className="text-xs text-gray-500 mb-1">Corte</div>
            <div className="text-sm">{getEstadoBadge(auditoria.estado)}</div>
          </div>

          {/* Proceso - Progress indicators */}
          <div className="col-span-3">
            <div className="text-xs text-gray-500 mb-2">Proceso</div>
            {/* Progress bar */}
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-2">
              <div
                className="h-full bg-green-500 rounded-full transition-all duration-300"
                style={{ width: `${checkPct}%` }}
              />
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500 shrink-0" />
                <span className="text-xs text-gray-500">Check</span>
                <span className="text-xs font-semibold text-gray-800">{checkPct.toFixed(0)}%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400 shrink-0" />
                <span className="text-xs text-gray-500">Pendiente</span>
                <span className="text-xs font-semibold text-gray-800">{pendientePct.toFixed(0)}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Button */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => onViewComplete(auditoria.id)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            Ver auditoría completa
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
