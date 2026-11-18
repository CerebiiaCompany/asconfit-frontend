export interface InformePreliminarHallazgoIA {
    finding_id: number;
    conclusion: string;
}

export interface PlanAccionIA {
    accion: string;
    plazo: string;
    prioridad: "alta" | "media" | "baja";
}

export interface InformePreliminarIA {
    /** Versiones anteriores del backend no lo envían. */
    resumen_ejecutivo?: string;
    introduccion: string;
    cierre_requerimientos: string;
    intro_hallazgos: string;
    hallazgos: InformePreliminarHallazgoIA[];
    plan_accion?: PlanAccionIA[];
    conclusion_general: string;
    /** Cuándo se generó con la IA (el backend lo guarda en caché mientras no cambien los datos). */
    generado_en?: string;
}
