import React, { useRef } from "react";
import { MapaCalorRiesgo, HeatMapTask } from "./MapaCalorRiesgo";
import { Auditoria } from "../../../types/auditoria";

interface PdfMatrizRiesgoModalProps {
  isOpen: boolean;
  onClose: () => void;
  auditoria: Auditoria;
  subtareas: HeatMapTask[];
  stats: {
    totalTasks: number;
    criticalTasks: number;
    avgGravedad: number;
    avgProbabilidad: number;
    avgDetencion: number;
    nprGlobal: number;
    nprLabel: { label: string; color: string };
  };
}

export const PdfMatrizRiesgoModal: React.FC<PdfMatrizRiesgoModalProps> = ({
  isOpen,
  onClose,
  auditoria,
  subtareas,
  stats,
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const nombreEmpresa =
    auditoria.empresa?.razon_social ||
    auditoria.empresa?.nombre ||
    auditoria.razon_social ||
    (auditoria as any).empresa_nombre ||
    "N/A";

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 print:p-0 print:bg-white print:static print:inset-auto">
      {/* Modal Card Container */}
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 w-full max-w-5xl overflow-hidden flex flex-col max-h-[92vh] print:max-h-none print:shadow-none print:border-none print:w-full print:rounded-none">
        
        {/* Modal Top Action Bar (Hidden during Print) */}
        <div className="px-6 py-4 bg-gray-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-orange-500 flex items-center justify-center text-white font-bold">
              PDF
            </div>
            <div>
              <h2 className="text-base font-bold">Exportar Matriz de Riesgo (PDF)</h2>
              <p className="text-xs text-gray-400">
                Vista previa del informe impreso con Mapa de Calor 5x5
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold shadow-md transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Imprimir / Descargar PDF
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 transition"
              title="Cerrar"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Printable Content Area */}
        <div
          ref={printRef}
          className="p-8 overflow-y-auto flex-1 space-y-6 bg-white text-gray-900 print:p-4 print:overflow-visible"
        >
          {/* Estilos CSS específicos para la impresión limpia */}
          <style>{`
            @media print {
              body * {
                visibility: hidden;
              }
              .print\\:static, .print\\:static * {
                visibility: visible;
              }
              .print\\:static {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
              }
              @page {
                size: A4 portrait;
                margin: 12mm;
              }
            }
          `}</style>

          {/* Encabezado del Documento */}
          <div className="border-b-2 border-orange-500 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-orange-600 uppercase tracking-widest">
                <span>ASCONFIT</span>
                <span>•</span>
                <span>Informe de Evaluación de Riesgos</span>
              </div>
              <h1 className="text-2xl font-black text-gray-900 mt-1">
                {(auditoria as any).titulo || auditoria.tipo_auditoria || auditoria.razon_social || "Matriz de Riesgo de Auditoría"}
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Empresa: <strong className="text-gray-800">{nombreEmpresa}</strong> | 
                Tipo: <strong className="text-gray-800">{auditoria.tipo_auditoria || "Auditoría"}</strong>
              </p>
            </div>
            <div className="text-right text-xs text-gray-500">
              <p className="font-semibold text-gray-700">Fecha de Informe:</p>
              <p className="font-medium text-gray-900">{currentDate}</p>
              <p className="mt-1 text-[11px] text-gray-400">ID Auditoría: #{auditoria.id}</p>
            </div>
          </div>

          {/* Resumen de Métricas */}
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
            <div className="bg-slate-50 p-3 rounded-2xl border border-gray-200 text-center">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Tareas</p>
              <p className="text-xl font-black text-gray-900 mt-1">{stats.totalTasks}</p>
            </div>
            <div className="bg-red-50 p-3 rounded-2xl border border-red-200 text-center">
              <p className="text-[10px] font-bold text-red-600 uppercase tracking-wider">Críticas</p>
              <p className="text-xl font-black text-red-700 mt-1">{stats.criticalTasks}</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl border border-gray-200 text-center">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Prom. Gravedad</p>
              <p className="text-xl font-black text-gray-900 mt-1">{stats.avgGravedad}</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl border border-gray-200 text-center">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Prom. Probabilidad</p>
              <p className="text-xl font-black text-gray-900 mt-1">{stats.avgProbabilidad}</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl border border-gray-200 text-center">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Prom. Detección</p>
              <p className="text-xl font-black text-gray-900 mt-1">{stats.avgDetencion}</p>
            </div>
            <div className="bg-orange-50 p-3 rounded-2xl border border-orange-200 text-center">
              <p className="text-[10px] font-bold text-orange-700 uppercase tracking-wider">NPR Promedio</p>
              <p className="text-xl font-black text-orange-900 mt-1">{stats.nprGlobal}</p>
            </div>
          </div>

          {/* Sección 1: Mapa de Calor 5x5 */}
          <div className="break-inside-avoid">
            <MapaCalorRiesgo tasks={subtareas} isPrintView={true} />
          </div>

          {/* Sección 2: Tabla Leyenda y Detalle de Tareas */}
          <div className="space-y-3 break-before-auto">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-base font-bold text-gray-900">
                📋 Leyenda y Registro Detallado de Tareas
              </h3>
              <span className="text-xs text-gray-500">
                Los números coinciden con la ubicación en el Mapa de Calor
              </span>
            </div>

            <div className="overflow-hidden rounded-2xl border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200 text-xs">
                <thead className="bg-gray-900 text-white font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-3 py-2.5 text-center w-12">#</th>
                    <th className="px-4 py-2.5 text-left">Tarea / Categoría</th>
                    <th className="px-3 py-2.5 text-center w-16">Gravedad</th>
                    <th className="px-3 py-2.5 text-center w-16">Probab.</th>
                    <th className="px-3 py-2.5 text-center w-16">Detec.</th>
                    <th className="px-3 py-2.5 text-center w-20">NPR</th>
                    <th className="px-4 py-2.5 text-center w-24">Nivel Riesgo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {subtareas.map((task) => (
                    <tr key={task.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-3 py-2.5 text-center font-black">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-900 text-white text-xs">
                          {task.numIndex}
                        </span>
                      </td>
                      <td className="px-4 py-2.5">
                        <p className="font-bold text-gray-900">{task.nombre}</p>
                        {task.categoriaNombre && (
                          <p className="text-[10px] text-gray-500">Cat: {task.categoriaNombre}</p>
                        )}
                      </td>
                      <td className="px-3 py-2.5 text-center font-semibold text-gray-700">
                        {task.gravedad}
                      </td>
                      <td className="px-3 py-2.5 text-center font-semibold text-gray-700">
                        {task.probabilidad}
                      </td>
                      <td className="px-3 py-2.5 text-center font-semibold text-gray-700">
                        {task.detencion}
                      </td>
                      <td className="px-3 py-2.5 text-center font-black text-gray-900">
                        {task.npr || "-"}
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            task.npr > 450
                              ? "bg-red-100 text-red-800 border border-red-200"
                              : task.npr > 225
                              ? "bg-orange-100 text-orange-800 border border-orange-200"
                              : task.npr > 100
                              ? "bg-amber-100 text-amber-800 border border-amber-200"
                              : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                          }`}
                        >
                          {task.nivel || "Bajo"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pie de página institucional */}
          <div className="pt-6 border-t border-gray-200 flex justify-between items-end text-xs text-gray-500">
            <div>
              <p className="font-semibold text-gray-700">ASCONFIT - Auditoría y Control Fiscal</p>
              <p className="text-[10px] text-gray-400">Documento generado automáticamente</p>
            </div>
            <div className="text-right border-t border-gray-300 pt-2 w-48">
              <p className="text-[10px] text-gray-400 uppercase tracking-widest text-center">Firma Responsable</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
