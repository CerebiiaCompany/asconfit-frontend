export interface InformePreliminarHallazgoIA {
    finding_id: number;
    conclusion: string;
}

export interface InformePreliminarIA {
    introduccion: string;
    cierre_requerimientos: string;
    intro_hallazgos: string;
    hallazgos: InformePreliminarHallazgoIA[];
    conclusion_general: string;
}
