export interface Subtarea {
    id: number;
    categoria_id: number;
    nombre: string;
    prioridad?: 'alta' | 'media' | 'baja';
    fecha_solicitud?: string;
    tiempo_entrega?: string;
    observaciones?: string;
    estado_informacion?: 'pendiente' | 'recibido' | 'revision' | 'aprobado';
    archivo_nombre?: string;
    archivo_path?: string;
    formato_archivo?: string;
    gravedad_riesgo?: number;
    probabilidad_riesgo?: number;
    detencion_riesgo?: number;
    npr?: number;
    nivel_riesgo?: string;
    orden: number;
    created_at: string;
    updated_at: string;
}

export interface Categoria {
    id: number;
    auditoria_id: number;
    nombre: string;
    orden: number;
    subtareas?: Subtarea[];
    created_at: string;
    updated_at: string;
}

export interface Auditoria {
    id: number;
    user_id: number;
    empresa_id?: number;
    empresa?: any; // Para la relación Eloquent si se carga como 'empresa'
    nit?: string;
    razon_social?: string;
    actividad_economica?: string;
    direccion?: string;
    responsable?: string;
    contacto?: string;
    pt?: string;
    tipo_auditoria?: string;
    fecha_inicial?: string;
    fecha_corte?: string;
    search_concepto?: string;
    gravedad_riesgo?: number;
    probabilidad_riesgo?: number;
    detencion_riesgo?: number;
    npr?: number;
    nivel_riesgo?: string;
    estado: 'pendiente' | 'en_progreso' | 'completada' | 'aprobado';
    categorias?: Categoria[];
    created_at: string;
    updated_at: string;
}

export interface AuditoriaStats {
    total: number;
    pendientes: number;
    checks: number;
}
