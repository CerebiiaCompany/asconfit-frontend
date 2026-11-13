import React from "react";
import { Building } from "lucide-react";
import { Encargo } from "../../services/userService";

const ESTADO_LABELS: Record<string, string> = {
    pendiente: "Pendiente",
    en_progreso: "En progreso",
    completada: "Completada",
    aprobado: "Aprobada",
};

const PAPEL_CONFIG = {
    principal: { label: "Auditor principal", className: "bg-orange-100 text-orange-700" },
    suplente: { label: "Auditor suplente", className: "bg-slate-200 text-slate-700" },
} as const;

interface EncargosListProps {
    encargos: Encargo[];
    emptyText?: string;
}

/**
 * Lista los encargos (empresas) de un usuario con su tipo de servicio y, por cada
 * auditoría, el tipo de auditoría y el papel que cumple (principal o suplente).
 */
export const EncargosList: React.FC<EncargosListProps> = ({
    encargos,
    emptyText = "No tiene encargos asignados",
}) => {
    if (encargos.length === 0) {
        return <p className="text-sm text-gray-400">{emptyText}</p>;
    }

    return (
        <div className="space-y-3">
            {encargos.map((e) => (
                <div key={e.empresa_id} className="bg-white border border-gray-200 rounded-xl p-4">
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 shrink-0 bg-orange-100 rounded-lg flex items-center justify-center">
                                <Building className="w-4 h-4 text-orange-500" />
                            </div>
                            <div className="min-w-0">
                                <p className="font-semibold text-gray-800 truncate">{e.razon_social}</p>
                                <p className="text-xs text-gray-500">NIT: {e.nit}</p>
                            </div>
                        </div>
                        <span className="shrink-0 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                            {e.tipo_servicio_label ?? "Sin tipo de servicio"}
                        </span>
                    </div>

                    {e.auditorias.length > 0 ? (
                        <ul className="mt-3 space-y-1.5 border-t border-gray-100 pt-3">
                            {e.auditorias.map((a) => {
                                const papel = PAPEL_CONFIG[a.papel];
                                return (
                                    <li key={a.id} className="flex flex-wrap items-center justify-between gap-2 text-sm">
                                        <span className="text-gray-700">
                                            Auditoría {a.tipo_auditoria ?? "sin tipo"}
                                            <span className="text-gray-400">
                                                {" · "}{ESTADO_LABELS[a.estado] ?? a.estado}
                                                {a.fecha_inicial && ` · ${a.fecha_inicial.split("-").reverse().join("/")}`}
                                            </span>
                                        </span>
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${papel.className}`}>
                                            {papel.label}
                                        </span>
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <p className="mt-3 border-t border-gray-100 pt-3 text-xs text-gray-400">
                            Sin auditorías como auditor principal o suplente
                        </p>
                    )}
                </div>
            ))}
        </div>
    );
};
