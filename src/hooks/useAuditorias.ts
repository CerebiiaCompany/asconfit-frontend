import { useState, useEffect } from 'react';
import type { Auditoria, AuditoriaStats } from '../types/auditoria';
import { auditoriaService } from '../services/auditoriaService';

export const useAuditorias = () => {
    const [auditorias, setAuditorias] = useState<Auditoria[]>([]);
    const [stats, setStats] = useState<AuditoriaStats>({
        total: 0,
        completadas: 0,
        en_progreso: 0,
        pendientes: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchAuditorias();
    }, []);

    const fetchAuditorias = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await auditoriaService.getAuditorias();
            // Laravel retorna datos paginados con la estructura { data: [...], total, per_page, etc }
            const auditoriasData = response.data || [];
            setAuditorias(auditoriasData);
            calculateStats(auditoriasData);
        } catch (err) {
            setError('Error al cargar las auditorías');
            console.error(err);
            setAuditorias([]);
            setStats({
                total: 0,
                completadas: 0,
                en_progreso: 0,
                pendientes: 0
            });
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (data: Auditoria[]) => {
        const newStats: AuditoriaStats = {
            total: data.length,
            completadas: data.filter(a => a.estado === 'completada').length,
            en_progreso: data.filter(a => a.estado === 'en_progreso').length,
            pendientes: data.filter(a => a.estado === 'pendiente' || a.estado === 'borrador').length
        };
        setStats(newStats);
    };

    return {
        auditorias,
        stats,
        loading,
        error,
        refetch: fetchAuditorias
    };
};
