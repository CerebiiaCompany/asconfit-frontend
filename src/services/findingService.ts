import { api } from "./api";

export interface FindingPayload {
    titulo: string;
    descripcion?: string;
    actividad_id?: number;
    severidad: "critico" | "grave" | "leve";
    responsable?: string;
    fecha_limite?: string;
}

/** En edición, los campos opcionales pueden enviarse en null para vaciarlos. */
export interface FindingUpdatePayload {
    titulo: string;
    descripcion: string | null;
    severidad: "critico" | "grave" | "leve";
    responsable: string | null;
    fecha_limite: string | null;
}

export interface FindingActividad {
    id: number;
    nombre: string;
    fecha_solicitud?: string | null;
    tiempo_entrega?: string | null;
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

    update: (auditoriaId: number, id: number, data: Partial<FindingUpdatePayload>) =>
        api.put<{ message: string; finding: Finding }>(
            `/auditorias/${auditoriaId}/findings/${id}`,
            data
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
