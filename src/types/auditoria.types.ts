export interface Subtarea {
    id: string;
    nombre: string;
    prioridad: string;
    fechaSolicitud: string;
    tiempoEntrega: string;
    observaciones: string;
    estadoInformacion: string;
    archivoNombre: string;
    formatoArchivo: 'pdf' | 'excel' | 'word' | '';
}

export interface Categoria {
    id: string;
    nombre: string;
    delegadoId: number | null;
    subtareas: Subtarea[];
}

export interface AuditoriaFormData {
    empresa: string;
    nit: string;
    razonSocial: string;
    actividadEconomica: string;
    direccion: string;
    responsable: string;
    contacto: string;
    pt: string;
    fechaInicial: string;
    fechaCorte: string;
    empresaId: number | null;
}

export interface NuevaAuditoriaData {
    formData: AuditoriaFormData;
    categorias: Categoria[];
    searchConcepto: string;
}
