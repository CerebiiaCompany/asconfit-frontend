import { useState, useEffect } from 'react';
import { Empresa, EmpresaStats } from '../types/empresa.types';
import { api } from '../services/api';

export const useEmpresas = () => {
    const [empresas, setEmpresas] = useState<Empresa[]>([]);
    const [stats, setStats] = useState<EmpresaStats>({
        total: 0,
        activas: 0,
        enRevision: 0,
        inactivas: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchEmpresas = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await api.get<Empresa[]>('/empresas');
            setEmpresas(data);
            calculateStats(data);
        } catch (err) {
            setError('Error al cargar las empresas');
            console.error('Error fetching empresas:', err);
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (empresasList: Empresa[]) => {
        const newStats: EmpresaStats = {
            total: empresasList.length,
            activas: empresasList.filter(e => e.estado === 'activa').length,
            enRevision: empresasList.filter(e => e.estado === 'revision').length,
            inactivas: empresasList.filter(e => e.estado === 'inactiva').length
        };
        setStats(newStats);
    };

    useEffect(() => {
        fetchEmpresas();
    }, []);

    return {
        empresas,
        stats,
        loading,
        error,
        refetch: fetchEmpresas
    };
};
