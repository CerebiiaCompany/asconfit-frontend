import { useState, useEffect } from 'react';
import { auditoriaService } from '../services/auditoriaService';

export interface TareaFlat {
    auditoriaId: number;
    auditoriaEmpresa: string;
    auditoriaNit: string;
    categoriaId: number;
    categoriaNombre: string;
    subtareaId: number;
    subtareaNombre: string;
    formatoArchivo: string | null;
    archivoNombre: string | null;
    observaciones: string | null;
    fechaSolicitud: string | null;
    fechaEntrega: string | null;
    fechaSubida: string | null;
    estadoInformacion: string | null;
}

export interface AuditoriaAgrupada {
    auditoriaId: number;
    empresaId: number;
    empresa: string;
    nit: string;
    tipoAuditoria: string;
    tareas: TareaFlat[];
}

export const useTareas = () => {
    const [tareas, setTareas] = useState<TareaFlat[]>([]);
    const [auditorias, setAuditorias] = useState<AuditoriaAgrupada[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const cargarTareas = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await auditoriaService.getAuditorias();
            const auditorias = response.data || response;

            // Aplanar todas las subtareas de todas las auditorías
            const tareasFlat: TareaFlat[] = [];
            auditorias.forEach((auditoria: any) => {
                auditoria.categorias?.forEach((categoria: any) => {
                    categoria.subtareas?.forEach((subtarea: any) => {
                        tareasFlat.push({
                            auditoriaId: auditoria.id,
                            auditoriaEmpresa: auditoria.empresa?.razon_social || 'Sin nombre',
                            auditoriaNit: auditoria.empresa?.nit || 'Sin NIT',
                            categoriaId: categoria.id,
                            categoriaNombre: categoria.nombre,
                            subtareaId: subtarea.id,
                            subtareaNombre: subtarea.nombre,
                            formatoArchivo: subtarea.formato_archivo,
                            archivoNombre: subtarea.archivo_nombre,
                            observaciones: subtarea.observaciones,
                            fechaSolicitud: subtarea.fecha_solicitud,
                            fechaEntrega: subtarea.tiempo_entrega,
                            fechaSubida: subtarea.fecha_subida,
                            estadoInformacion: subtarea.estado_informacion
                        });
                    });
                });
            });

            setTareas(tareasFlat);

            // Agrupar por auditoría
            const auditoriasMap = new Map<number, AuditoriaAgrupada>();
            tareasFlat.forEach(tarea => {
                if (!auditoriasMap.has(tarea.auditoriaId)) {
                    const auditoria = auditorias.find((a: any) => a.id === tarea.auditoriaId);
                    // Intentar obtener empresaId de múltiples fuentes
                    const empresaId = auditoria?.empresa_id || auditoria?.empresa?.id || 0;

                    console.log('Debug useTareas - auditoria:', auditoria);
                    console.log('Debug useTareas - empresa_id directo:', auditoria?.empresa_id);
                    console.log('Debug useTareas - empresa.id:', auditoria?.empresa?.id);
                    console.log('Debug useTareas - empresaId final:', empresaId);

                    auditoriasMap.set(tarea.auditoriaId, {
                        auditoriaId: tarea.auditoriaId,
                        empresaId: empresaId,
                        empresa: tarea.auditoriaEmpresa,
                        nit: tarea.auditoriaNit,
                        tipoAuditoria: auditoria?.tipo_auditoria || 'N/A',
                        tareas: []
                    });
                }
                auditoriasMap.get(tarea.auditoriaId)!.tareas.push(tarea);
            });

            setAuditorias(Array.from(auditoriasMap.values()));
        } catch (err) {
            console.error('Error al cargar tareas:', err);
            setError('No se pudieron cargar las tareas');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarTareas();
    }, []);

    return {
        tareas,
        auditorias,
        loading,
        error,
        recargar: cargarTareas
    };
};
