import React from "react";
import { Finding } from "../../services/findingService";

const SEV_CONFIG = {
    critico: { label: "Crítico", dot: "bg-red-500", badge: "bg-red-100 text-red-700" },
    grave: { label: "Grave", dot: "bg-yellow-400", badge: "bg-yellow-100 text-yellow-700" },
    leve: { label: "Leve", dot: "bg-green-500", badge: "bg-green-100 text-green-700" },
};

interface FindingsTableProps {
    findings: Finding[];
}

export function FindingsTable({ findings }: FindingsTableProps) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-gray-100 bg-gray-50">
                            <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Hallazgo</th>
                            <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Auditoría</th>
                            <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Actividad</th>
                            <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Severidad</th>
                            <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Responsable</th>
                            <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Fecha límite</th>
                        </tr>
                    </thead>
                    <tbody>
                        {findings.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center py-12 text-gray-400 text-sm">
                                    No hay hallazgos para mostrar
                                </td>
                            </tr>
                        ) : findings.map(f => {
                            const sev = SEV_CONFIG[f.severidad] ?? SEV_CONFIG.leve;
                            const empresa = f.auditoria?.empresa?.razon_social ?? `Auditoría #${f.auditoria_id}`;
                            return (
                                <tr key={f.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3 font-medium text-gray-800 max-w-[200px] truncate">{f.titulo}</td>
                                    <td className="px-4 py-3 text-gray-600 max-w-[160px] truncate">{empresa}</td>
                                    <td className="px-4 py-3 text-gray-500 max-w-[140px] truncate">{f.actividad?.nombre ?? "—"}</td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${sev.badge}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${sev.dot}`} />
                                            {sev.label}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-600">{f.responsable ?? "—"}</td>
                                    <td className="px-4 py-3 text-gray-500">
                                        {f.fecha_limite
                                            ? new Date(f.fecha_limite).toLocaleDateString("es-CO", { day: "2-digit", month: "2-digit", year: "numeric" })
                                            : "—"}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
