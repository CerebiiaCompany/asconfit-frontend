import React, { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { findingService, Finding } from "../../../services/findingService";
import { SEVERIDAD_CONFIG } from "../../../types/finding.types";
import { EditarFindingModal } from "../../Findings/EditarFindingModal";

interface HallazgosActividadModalProps {
    auditoria: any;
    subtarea: { id: number; nombre: string; fecha_solicitud?: string | null; tiempo_entrega?: string | null };
    onClose: () => void;
    /** Abre el formulario para registrar un hallazgo nuevo en esta actividad. */
    onNuevo: () => void;
}

const formatFecha = (d?: string | null) =>
    d ? new Date(`${d.slice(0, 10)}T00:00:00`).toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" }) : null;

/**
 * Hallazgos ya registrados en una actividad de la auditoría, con la opción de
 * editarlos (autor o admin, igual que el backend) o registrar uno nuevo.
 */
export const HallazgosActividadModal: React.FC<HallazgosActividadModalProps> = ({
    auditoria, subtarea, onClose, onNuevo,
}) => {
    const { user } = useAuth();
    const [findings, setFindings] = useState<Finding[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [editing, setEditing] = useState<Finding | null>(null);

    const isAdmin = user?.role?.nombre?.toLowerCase() === "admin";
    const canEdit = (f: Finding) => isAdmin || (!!user && Number(f.user_id) === Number(user.id));
    const empresa = auditoria?.empresa ?? (auditoria?.razon_social ? { id: auditoria.empresa_id, razon_social: auditoria.razon_social } : undefined);

    const cargar = useCallback(() => {
        setError(null);
        findingService
            .getByAuditoria(auditoria.id)
            .then((all) => setFindings(all.filter((f) => Number(f.actividad_id) === Number(subtarea.id))))
            .catch(() => setError("No se pudieron cargar los hallazgos de esta actividad."));
    }, [auditoria.id, subtarea.id]);

    useEffect(() => { cargar(); }, [cargar]);

    if (editing) {
        return (
            <EditarFindingModal
                finding={{
                    ...editing,
                    // El modal de edición usa la empresa y las fechas de la actividad
                    auditoria: editing.auditoria ?? { id: auditoria.id, empresa },
                    actividad: editing.actividad ?? { id: subtarea.id, nombre: subtarea.nombre, fecha_solicitud: subtarea.fecha_solicitud, tiempo_entrega: subtarea.tiempo_entrega },
                }}
                onClose={() => setEditing(null)}
                onSaved={(saved) => {
                    setFindings((prev) => prev?.map((f) => (f.id === saved.id ? { ...f, ...saved } : f)) ?? null);
                    setEditing(null);
                }}
            />
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="flex items-start justify-between gap-4 px-6 py-4 border-b border-gray-100">
                    <div className="min-w-0">
                        <h2 className="text-lg font-semibold text-gray-800">Hallazgos de la actividad</h2>
                        <p className="text-xs text-gray-400 mt-0.5 truncate">{subtarea.nombre}</p>
                    </div>
                    <button
                        onClick={onClose}
                        aria-label="Cerrar"
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-4">
                    {error ? (
                        <div className="flex items-center justify-between gap-3 p-3 bg-red-50 border border-red-100 rounded-lg">
                            <p className="text-sm text-red-700">{error}</p>
                            <button onClick={cargar} className="text-sm font-medium text-red-700 hover:text-red-900">Reintentar</button>
                        </div>
                    ) : findings === null ? (
                        <p className="text-sm text-gray-400 italic">Cargando hallazgos...</p>
                    ) : findings.length === 0 ? (
                        <p className="text-sm text-gray-500">Esta actividad no tiene hallazgos registrados.</p>
                    ) : (
                        <ul className="divide-y divide-gray-100">
                            {findings.map((f) => {
                                const sev = SEVERIDAD_CONFIG[f.severidad as keyof typeof SEVERIDAD_CONFIG];
                                const fecha = formatFecha(f.fecha_limite);
                                return (
                                    <li key={f.id} className="py-3 flex items-start justify-between gap-4">
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-gray-900 flex items-center gap-2">
                                                {sev && <span className={`shrink-0 w-2 h-2 rounded-full ${sev.color}`} />}
                                                <span className="truncate">{f.titulo}</span>
                                            </p>
                                            {f.descripcion && (
                                                <p className="text-sm text-gray-600 mt-0.5 line-clamp-2">{f.descripcion}</p>
                                            )}
                                            <p className="text-xs text-gray-400 mt-1">
                                                {sev?.label}
                                                {f.responsable ? `, responsable: ${f.responsable}` : ""}
                                                {fecha ? `, fecha límite: ${fecha}` : ", sin fecha límite"}
                                            </p>
                                        </div>
                                        {canEdit(f) && (
                                            <button
                                                onClick={() => setEditing(f)}
                                                className="shrink-0 px-3 py-1.5 rounded-lg border border-orange-400 text-orange-600 hover:bg-orange-50 text-xs font-medium transition-colors"
                                            >
                                                Editar
                                            </button>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>

                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Cerrar
                    </button>
                    <button
                        onClick={onNuevo}
                        className="px-5 py-2.5 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors"
                    >
                        Nuevo hallazgo
                    </button>
                </div>
            </div>
        </div>
    );
};
