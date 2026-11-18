import React, { useState } from "react";
import { Encargo } from "../../services/userService";

const VISIBLES = 2;

/** Papeles del usuario en las auditorías de una empresa, sin repetir. */
const papeles = (e: Encargo): string[] => {
    const set = new Set(e.auditorias.map((a) => a.papel));
    const out: string[] = [];
    if (set.has("principal")) out.push("Principal");
    if (set.has("suplente")) out.push("Suplente");
    return out;
};

/**
 * Resumen de los encargos de un usuario para la tabla de administración:
 * empresa y papel (principal / suplente) sin tener que abrir el perfil.
 */
export const EncargosCell: React.FC<{ encargos?: Encargo[] }> = ({ encargos }) => {
    const [expandido, setExpandido] = useState(false);

    if (!encargos) return <span className="text-xs text-gray-400">—</span>;
    if (encargos.length === 0) {
        return <span className="text-xs text-gray-400 italic">Sin encargos</span>;
    }

    const lista = expandido ? encargos : encargos.slice(0, VISIBLES);
    const ocultos = encargos.length - VISIBLES;

    return (
        <div className="min-w-[14rem] max-w-xs space-y-1.5">
            <ul className="space-y-1.5">
                {lista.map((e) => {
                    const ps = papeles(e);
                    return (
                        <li key={e.empresa_id} className="text-sm leading-tight">
                            <span className="block font-medium text-gray-800 truncate" title={e.razon_social}>
                                {e.razon_social}
                            </span>
                            <span className="text-xs text-gray-500">
                                {e.tipo_servicio_label ?? "Sin tipo de servicio"}
                                {ps.length > 0 ? (
                                    ps.map((p) => (
                                        <span
                                            key={p}
                                            className={`ml-1.5 inline-block px-1.5 py-px rounded text-[11px] font-medium ${p === "Principal" ? "bg-orange-100 text-orange-700" : "bg-slate-200 text-slate-700"}`}
                                        >
                                            {p}
                                        </span>
                                    ))
                                ) : (
                                    <span className="ml-1.5 text-gray-400">(asignada, sin auditorías)</span>
                                )}
                            </span>
                        </li>
                    );
                })}
            </ul>
            {ocultos > 0 && (
                <button
                    type="button"
                    onClick={() => setExpandido((v) => !v)}
                    aria-expanded={expandido}
                    className="text-xs font-medium text-orange-600 hover:text-orange-700 focus:outline-none focus-visible:underline"
                >
                    {expandido ? "Ver menos" : `Ver ${ocultos} más`}
                </button>
            )}
        </div>
    );
};
