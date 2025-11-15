export interface Auditoria {
    id: number;
    titulo: string;
    descripcion: string;
    estado: 'pendiente' | 'en_progreso' | 'completada';
    fecha_creacion: string;
    fecha_actualizacion: string;
    empresa_id?: number;
    usuario_id?: number;
}

export interface AuditoriaStats {
    total: number;
    completadas: number;
    en_progreso: number;
    pendientes: number;
}
