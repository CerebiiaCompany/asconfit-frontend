export interface Auditoria {
    id: number;
    user_id: number;
    empresa?: string;
    nit?: string;
    razon_social?: string;
    actividad_economica?: string;
    direccion?: string;
    responsable?: string;
    contacto?: string;
    pt?: string;
    fecha_inicial?: string;
    fecha_corte?: string;
    search_concepto?: string;
    estado: 'pendiente' | 'en_progreso' | 'completada';
    created_at: string;
    updated_at: string;
}

export interface AuditoriaStats {
    total: number;
    completadas: number;
    en_progreso: number;
    pendientes: number;
}
