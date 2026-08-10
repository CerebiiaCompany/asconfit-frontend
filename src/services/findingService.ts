import { api } from "./api";

export interface FindingPayload {
    titulo: string;
    descripcion?: string;
    actividad_id?: number;
    severidad: "critico" | "grave" | "leve";
    responsable?: string;
    fecha_limite?: string;
}

export interface FindingActividad {
    id: number;
    nombre: string;
}

export interface FindingAuditoria {
    id: number;
    empresa?: { id: number; razon_social: string };
    pt?: string;
    tipo_auditoria?: string;
}

export interface Finding extends FindingPayload {
    id: number;
    auditoria_id: number;
    user_id: number;
    auditoria?: FindingAuditoria;
    actividad?: FindingActividad;
    created_at: string;
    updated_at: string;
}

export const findingService = {
    getAll: () =>
        api.get<Finding[]>(`/findings`),

    getByAuditoria: (auditoriaId: number) =>
        api.get<Finding[]>(`/auditorias/${auditoriaId}/findings`),

    create: (auditoriaId: number, findings: FindingPayload[]) =>
        api.post<{ message: string; findings: Finding[] }>(
            `/auditorias/${auditoriaId}/findings`,
            { findings }
        ),

    delete: (auditoriaId: number, id: number) =>
        api.delete<{ message: string }>(`/auditorias/${auditoriaId}/findings/${id}`),

    getStats: (params?: {
        empresa_id?: number;
        delegado_id?: number;
        fecha_desde?: string;
        fecha_hasta?: string;
    }) => {
        const query = params
            ? "?" + new URLSearchParams(
                Object.entries(params)
                    .filter(([, v]) => v !== undefined && v !== "")
                    .map(([k, v]) => [k, String(v)])
            ).toString()
            : "";
        return api.get<{
            this_month: number;
            by_severity: { critico: number; grave: number; leve: number };
            total: number;
        }>(`/findings/estadisticas${query}`);
    },
};
