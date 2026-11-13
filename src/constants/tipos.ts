/**
 * Catálogos de tipos. Deben coincidir con el backend:
 *  - Empresa::TIPOS_SERVICIO   (tipo de servicio de un encargo/empresa)
 *  - Auditoria::TIPOS_AUDITORIA (tipo de auditoría)
 */

/** Tipo de servicio de un encargo (empresa). */
export const TIPOS_SERVICIO = [
    { value: "control_interno", label: "Control Interno" },
    { value: "revisoria_fiscal", label: "Revisoría Fiscal" },
    { value: "auditoria", label: "Auditoría" },
] as const;

export const TIPO_SERVICIO_LABELS: Record<string, string> = Object.fromEntries(
    TIPOS_SERVICIO.map((t) => [t.value, t.label])
);

/** Tipos de auditoría (se guarda el texto tal cual). */
export const TIPOS_AUDITORIA = [
    "Tributaria",
    "Financiera",
    "Operativa",
    "Cumplimiento",
    "Sistemas",
    "Control Interno",
    "Inventarios",
    "Calidad",
    "Gestión",
] as const;
