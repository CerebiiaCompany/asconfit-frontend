import { useState, useEffect } from 'react';
import type { Auditoria, AuditoriaStats } from '../types/auditoria';

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
            // TODO: Implementar llamada a la API
            // const response = await api.get('/auditorias');
            // setAuditorias(response.data);
            // calculateStats(response.data);
            setAuditorias([]);
            setStats({
                total: 0,
                completadas: 0,
                en_progreso: 0,
                pendientes: 0
            });
        } catch (err) {
            setError('Error al cargar las auditorías');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (data: Auditoria[]) => {
        const newStats: AuditoriaStats = {
            total: data.length,
            completadas: data.filter(a => a.estado === 'completada').length,
            en_progreso: data.filter(a => a.estado === 'en_progreso').length,
            pendientes: data.filter(a => a.estado === 'pendiente').length
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
