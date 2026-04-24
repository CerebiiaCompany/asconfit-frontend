export interface PredictiveAlert {
    id: number;
    severidad: 'CRÍTICA' | 'ALTA' | 'MEDIA' | 'BAJA';
    area: string;
    titulo: string;
    descripcion: string;
    normativa: string;
    impacto: string;
    probabilidad: 'ALTA' | 'MEDIA' | 'BAJA';
}

export interface AnalysisResumen {
    calificacion_global: 'CRÍTICO' | 'ALTO' | 'MEDIO' | 'BAJO';
    sintesis: string;
    areas_exposicion: string[];
}

export interface AnalysisRecomendaciones {
    inmediato: string[];
    corto_plazo: string[];
    mediano_plazo: string[];
}

export interface AnalysisResult {
    resumen: AnalysisResumen;
    alertas: PredictiveAlert[];
    recomendaciones: AnalysisRecomendaciones;
}
