import React, { useState } from "react";
import { findingService, Finding } from "../../services/findingService";
import { SeveridadSelector } from "../auditorias/Findings/SeveridadSelector";
import { FechaLimiteField } from "../auditorias/Findings/FechaLimiteField";

interface EditarFindingModalProps {
    finding: Finding;
    onClose: () => void;
    onSaved: (finding: Finding) => void;
}

const toDateStr = (val?: string | null) => (val ? val.slice(0, 10) : "");

export const EditarFindingModal: React.FC<EditarFindingModalProps> = ({ finding, onClose, onSaved }) => {
    const [titulo, setTitulo] = useState(finding.titulo ?? "");
    const [descripcion, setDescripcion] = useState(finding.descripcion ?? "");
    const [severidad, setSeveridad] = useState<"critico" | "grave" | "leve">(finding.severidad);
    const [responsable, setResponsable] = useState(finding.responsable ?? "");
    const [fechaLimite, setFechaLimite] = useState(toDateStr(finding.fecha_limite));
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const empresaNombre = finding.auditoria?.empresa?.razon_social ?? `Auditoría #${finding.auditoria_id}`;

    // Misma regla que al crear un hallazgo: la fecha límite debe estar dentro del
    // rango de fechas de la actividad (pendiente de validación del negocio, punto 15).
    const minDate = toDateStr(finding.actividad?.fecha_solicitud) || undefined;
    const maxDate = toDateStr(finding.actividad?.tiempo_entrega) || undefined;

    const handleDateChange = (val: string) => {
        if (val && ((minDate && val < minDate) || (maxDate && val > maxDate))) return;
        setFechaLimite(val);
    };


    const handleSave = async () => {
        if (!titulo.trim()) {
            setError("El hallazgo debe tener un título.");
            return;
        }
        setSaving(true);
        setError(null);
        try {
            const res = await findingService.update(finding.auditoria_id, finding.id, {
                titulo: titulo.trim(),
                descripcion: descripcion.trim() || null,
                severidad,
                responsable: responsable.trim() || null,
                fecha_limite: fechaLimite || null,
            });
            // Conservamos la auditoría (con empresa) que ya traía el listado
            onSaved({ ...finding, ...res.finding, auditoria: finding.auditoria });
        } catch (err: any) {
            setError(err.message || "Error al actualizar el hallazgo.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800">Editar Hallazgo</h2>
                        <p className="text-xs text-gray-400 mt-0.5">{empresaNombre}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Título del hallazgo <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={titulo}
                            onChange={(e) => setTitulo(e.target.value)}
                            placeholder="Describe el hallazgo"
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                        <textarea
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            placeholder="Detalle del hallazgo..."
                            rows={3}
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Auditoría</label>
                            <div className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-600 truncate">
                                {empresaNombre}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Actividad</label>
                            <div className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-600 truncate">
                                {finding.actividad?.nombre ?? "—"}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Severidad <span className="text-red-500">*</span>
                            </label>
                            <SeveridadSelector value={severidad} onChange={setSeveridad} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Responsable</label>
                            <input
                                type="text"
                                value={responsable}
                                onChange={(e) => setResponsable(e.target.value)}
                                placeholder="Nombre del responsable"
                                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <FechaLimiteField
                        value={fechaLimite}
                        minDate={minDate}
                        maxDate={maxDate}
                        disabled={!finding.actividad_id}
                        onChange={handleDateChange}
                    />
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
                    {error && <p className="flex-1 text-xs text-red-500">{error}</p>}
                    <button
                        onClick={onClose}
                        disabled={saving}
                        className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-5 py-2.5 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors disabled:opacity-60 flex items-center gap-2"
                    >
                        {saving && (
                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                            </svg>
                        )}
                        Guardar cambios
                    </button>
                </div>
            </div>
        </div>
    );
};
