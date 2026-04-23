import React from "react";
import { Auditoria } from "../../../types/auditoria";

const ESTADO_CONFIG: Record<string, { label: string; dot: string; text: string }> = {
    aprobado: { label: "Aprobado", dot: "bg-green-500", text: "text-green-700" },
    rechazado: { label: "Rechazado", dot: "bg-red-500", text: "text-red-700" },
    pendiente: { label: "Pendiente", dot: "bg-yellow-400", text: "text-yellow-700" },
    recibido: { label: "Recibido", dot: "bg-blue-400", text: "text-blue-700" },
    revision: { label: "Revisión", dot: "bg-purple-400", text: "text-purple-700" },
};

interface ReportTaskListProps {
    auditoria: Auditoria;
}

export const ReportTaskList: React.FC<ReportTaskListProps> = ({ auditoria }) => {
    const allSubtareas = (auditoria.categorias ?? []).flatMap(cat =>
        (cat.subtareas ?? []).map(s => ({ ...s, categoriaNombre: cat.nombre }))
    );

    const formatDate = (d?: string) => {
        if (!d) return "—";
        return d.includes("T") ? d.split("T")[0] : d;
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-4">
                <h2 className="text-white font-semibold text-base">Listado de Requerimientos</h2>
                <p className="text-orange-100 text-xs mt-0.5">{allSubtareas.length} tareas en total</p>
            </div>

            <div className="divide-y divide-gray-100 max-h-[calc(100vh-220px)] overflow-y-auto">
                {allSubtareas.length === 0 ? (
                    <p className="text-center text-gray-400 text-sm py-12">Sin requerimientos</p>
                ) : allSubtareas.map((s, i) => {
                    const estado = s.estado_informacion ?? "pendiente";
                    const cfg = ESTADO_CONFIG[estado] ?? ESTADO_CONFIG.pendiente;
                    return (
                        <div key={s.id ?? i} className="px-5 py-3.5 hover:bg-gray-50 transition-colors">
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-800 leading-snug">{s.nombre}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">{s.categoriaNombre}</p>
                                </div>
                                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-opacity-10 shrink-0 ${cfg.text} bg-gray-100`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                                    {cfg.label}
                                </span>
                            </div>
                            <div className="flex gap-4 mt-1.5 text-xs text-gray-400">
                                {s.fecha_solicitud && <span>Solicitud: {formatDate(s.fecha_solicitud)}</span>}
                                {s.tiempo_entrega && <span>Entrega: {formatDate(s.tiempo_entrega)}</span>}
                                {s.archivo_nombre && (
                                    <span className="text-orange-500 truncate max-w-[140px]" title={s.archivo_nombre}>
                                        📎 {s.archivo_nombre}
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
