export interface Categoria {
    id: string;
    nombre: string;
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
}

export interface NuevaAuditoriaData {
    formData: AuditoriaFormData;
    categorias: Categoria[];
    searchConcepto: string;
}
