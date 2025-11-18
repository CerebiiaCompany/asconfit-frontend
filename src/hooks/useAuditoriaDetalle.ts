import { useState, useEffect } from 'react';
import { auditoriaService } from '../services/auditoriaService';

export const useAuditoriaDetalle = (id: string | undefined) => {
    const [auditoria, setAuditoria] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchAuditoria = async () => {
        if (!id) return;

        try {
            setLoading(true);
            const response = await auditoriaService.getAuditoria(id);
            setAuditoria(response);
        } catch (error) {
            console.error('Error al cargar la auditoría:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAuditoria();
    }, [id]);

    return {
        auditoria,
        loading,
        refetch: fetchAuditoria
    };
};
