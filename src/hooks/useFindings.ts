import { useState } from "react";
import { findingService } from "../services/findingService";
import { Auditoria } from "../types/auditoria";
import { Finding, emptyFinding } from "../types/finding.types";

export function useFindings(auditoria: Auditoria, onClose: () => void, onSave?: (findings: Finding[]) => void, initialActividadId?: number | null) {
    const [findings, setFindings] = useState<Finding[]>([{ ...emptyFinding(), actividad_id: initialActividadId ?? null }]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const update = <K extends keyof Finding>(index: number, field: K, value: Finding[K]) => {
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
                    actividad_id: f.actividad_id ?? undefined,
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

    return {
        findings,
        activeIndex,
        setActiveIndex,
        saving,
        error,
        current: findings[activeIndex],
        update,
        addFinding,
        removeFinding,
        handleSave,
    };
}
