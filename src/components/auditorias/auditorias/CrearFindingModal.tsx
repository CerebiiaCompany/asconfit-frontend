import React, { useState } from "react";
import { Auditoria } from "../../../types/auditoria";
import { findingService, FindingPayload } from "../../../services/findingService";

interface Finding {
    titulo: string;
    descripcion: string;
    actividad: string;
    severidad: "critico" | "grave" | "leve" | "";
    responsable: string;
    fecha_limite: string;
}

interface CrearFindingModalProps {
    auditoria: Auditoria;
    onClose: () => void;
    onSave?: (findings: Finding[]) => void;
}

const SEVERIDAD_CONFIG = {
    critico: { label: "Crítico", color: "bg-red-500", ring: "ring-red-500", text: "text-red-600" },
    grave: { label: "Grave", color: "bg-yellow-400", ring: "ring-yellow-400", text: "text-yellow-600" },
    leve: { label: "Leve", color: "bg-green-500", ring: "ring-green-500", text: "text-green-600" },
};

const emptyFinding = (): Finding => ({
    titulo: "",
    descripcion: "",
    actividad: "",
    severidad: "",
    responsable: "",
    fecha_limite: "",
});

export const CrearFindingModal: React.FC<CrearFindingModalProps> = ({
    auditoria,
    onClose,
    onSave,
}) => {
    const [findings, setFindings] = useState<Finding[]>([emptyFinding()]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const empresaNombre =
        auditoria.empresa?.razon_social || auditoria.razon_social || `Auditoría #${auditoria.id}`;

    const update = (index: number, field: keyof Finding, value: string) => {
        setFindings((prev) =>
            prev.map((f, i) => (i === index ? { ...f, [field]: value } : f))
        );
    };

    const addFinding = () => {
        setFindings((prev) => [...prev, emptyFinding()]);
        setActiveIndex(findings.length);
    };

    const removeFinding = (index: number) => {
        if (findings.length === 1) return;
        const next = findings.filter((_, i) => i !== index);
        setFindings(next);
        setActiveIndex(Math.min(activeIndex, next.length - 1));
    };

    const handleSave = async () => {
        const invalid = findings.find((f) => !f.titulo.trim() || !f.severidad);
        if (invalid) {
            setError("Todos los hallazgos deben tener título y severidad.");
            return;
        }
        setSaving(true);
        setError(null);
        try {
            await findingService.create(
                auditoria.id,
                findings.map((f) => ({
                    titulo: f.titulo,
                    descripcion: f.descripcion || undefined,
                    actividad: f.actividad || undefined,
                    severidad: f.severidad as "critico" | "grave" | "leve",
                    responsable: f.responsable || undefined,
                    fecha_limite: f.fecha_limite || undefined,
                }))
            );
            onSave?.(findings);
            onClose();
        } catch (err: any) {
            setError(err.message || "Error al guardar los hallazgos.");
        } finally {
            setSaving(false);
        }
    };

    const current = findings[activeIndex];

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
                {findings.length > 1 && (
                    <div className="flex items-center gap-2 px-6 pt-3 overflow-x-auto">
                        {findings.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveIndex(i)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${activeIndex === i
                                        ? "bg-orange-500 text-white"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                            >
                                Hallazgo {i + 1}
                                <span
                                    onClick={(e) => { e.stopPropagation(); removeFinding(i); }}
                                    className="ml-1 hover:text-red-300 cursor-pointer"
                                >
                                    ×
                                </span>
                            </button>
                        ))}
                        <button
                            onClick={addFinding}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-500 hover:bg-orange-50 hover:text-orange-600 transition-colors whitespace-nowrap"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Agregar
                        </button>
                    </div>
                )}

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
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
                            <input
                                type="text"
                                value={current.actividad}
                                onChange={(e) => update(activeIndex, "actividad", e.target.value)}
                                placeholder="Actividad relacionada"
                                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Severidad <span className="text-red-500">*</span>
                            </label>
                            <div className="flex gap-2">
                                {(["critico", "grave", "leve"] as const).map((sev) => {
                                    const cfg = SEVERIDAD_CONFIG[sev];
                                    const selected = current.severidad === sev;
                                    return (
                                        <button
                                            key={sev}
                                            type="button"
                                            onClick={() => update(activeIndex, "severidad", sev)}
                                            className={`flex-1 flex flex-col items-center gap-1.5 py-2.5 rounded-lg border-2 transition-all text-xs font-medium ${selected
                                                    ? `border-current ${cfg.text} bg-gray-50 ring-2 ${cfg.ring} ring-offset-1`
                                                    : "border-gray-200 text-gray-500 hover:border-gray-300"
                                                }`}
                                        >
                                            <span className={`w-3.5 h-3.5 rounded-full ${cfg.color}`} />
                                            {cfg.label}
                                        </button>
                                    );
                                })}
                            </div>
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

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Fecha límite</label>
                        <input
                            type="date"
                            value={current.fecha_limite}
                            onChange={(e) => update(activeIndex, "fecha_limite", e.target.value)}
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                        />
                    </div>

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
