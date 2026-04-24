export interface PredictiveAlert {
    id: number;
    level: 'CRITICA' | 'ALTA' | 'MEDIA';
    title: string;
    description: string;
    area: string;
    probability: string;
}

export interface AnalysisResult {
    resumen: string;
    alertas: PredictiveAlert[];
}
