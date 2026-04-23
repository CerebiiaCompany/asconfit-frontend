import React from "react";
import { Subtarea } from "../../../types/auditoria";
import { CrearFindingModalProps } from "../../../types/finding.types";
import { useFindings } from "../../../hooks/useFindings";
import { FindingTabs } from "./FindingTabs";
import { SeveridadSelector } from "./SeveridadSelector";
import { FechaLimiteField } from "./FechaLimiteField";

export const CrearFindingModal: React.FC<CrearFindingModalProps> = ({
    auditoria,
    onClose,
    onSave,
    initialActividadId,
}) => {
    const {
        findings,
        activeIndex,
        setActiveIndex,
        saving,
        error,
        current,
        update,
        addFinding,
        removeFinding,
        handleSave,
    } = useFindings(auditoria, onClose, onSave, initialActividadId);

    const allSubtareas: Subtarea[] = (auditoria.categorias ?? []).flatMap(
        (cat) => cat.subtareas ?? []
    );

    const empresaNombre =
        auditoria.empresa?.razon_social || auditoria.razon_social || `Auditoría #${auditoria.id}`;

    // Rango de fechas de la actividad seleccionada (recortado a YYYY-MM-DD)
    const selectedAct = current.actividad_id
        ? allSubtareas.find((s) => s.id === current.actividad_id)
        : null;
    const minDate = selectedAct?.fecha_solicitud ? selectedAct.fecha_solicitud.slice(0, 10) : undefined;
    const maxDate = selectedAct?.tiempo_entrega ? selectedAct.tiempo_entrega.slice(0, 10) : undefined;
    const fechaDisabled = !current.actividad_id;

    const handleDateChange = (val: string) => {
        if (!val) { update(activeIndex, "fecha_limite", ""); return; }
        const outOfRange =
            (minDate && val < minDate) ||
            (maxDate && val > maxDate);
        if (outOfRange) return;
        update(activeIndex, "fecha_limite", val);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800">Crear Hallazgo</h2>
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

                {/* Tabs */}
                <FindingTabs
                    findings={findings}
                    activeIndex={activeIndex}
                    onSelect={setActiveIndex}
                    onRemove={removeFinding}
                    onAdd={addFinding}
                />

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">

                    {/* Título */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Título del hallazgo <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={current.titulo}
                            onChange={(e) => update(activeIndex, "titulo", e.target.value)}
                            placeholder="Describe el hallazgo"
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                        />
                    </div>

                    {/* Descripción */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                        <textarea
                            value={current.descripcion}
                            onChange={(e) => update(activeIndex, "descripcion", e.target.value)}
                            placeholder="Detalle del hallazgo..."
                            rows={3}
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent resize-none"
                        />
                    </div>

                    {/* Auditoría + Actividad */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Auditoría <span className="text-red-500">*</span>
                            </label>
                            <div className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-600 truncate">
                                {empresaNombre}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Actividad <span className="text-red-500">*</span>
                            </label>
                            <div className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-600 truncate">
                                {current.actividad_id
                                    ? allSubtareas.find((s) => s.id === current.actividad_id)?.nombre ?? "—"
                                    : "—"}
                            </div>
                        </div>
                    </div>

                    {/* Severidad + Responsable */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Severidad <span className="text-red-500">*</span>
                            </label>
                            <SeveridadSelector
                                value={current.severidad}
                                onChange={(sev) => update(activeIndex, "severidad", sev)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Responsable</label>
                            <input
                                type="text"
                                value={current.responsable}
                                onChange={(e) => update(activeIndex, "responsable", e.target.value)}
                                placeholder="Nombre del responsable"
                                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Fecha límite */}
                    <FechaLimiteField
                        value={current.fecha_limite}
                        minDate={minDate}
                        maxDate={maxDate}
                        disabled={fechaDisabled}
                        onChange={handleDateChange}
                    />

                    {/* Agregar otro hallazgo */}
                    {findings.length === 1 && (
                        <button
                            onClick={addFinding}
                            className="flex items-center gap-2 text-sm text-orange-500 hover:text-orange-600 font-medium transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Agregar otro hallazgo
                        </button>
                    )}
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
                        Crear Hallazgo{findings.length > 1 ? `s (${findings.length})` : ""}
                    </button>
                </div>

            </div>
        </div>
    );
};
