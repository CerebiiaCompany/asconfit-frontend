import { useState, useEffect } from 'react';
import { documentoService, Documento } from '../services/documentoService';
import { useToast } from '../contexts/ToastContext';

export function usePapelera() {
    const [documentos, setDocumentos] = useState<Documento[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [showConfirm, setShowConfirm] = useState(false);
    const { addToast } = useToast();

    const loadTrashed = async () => {
        try {
            setLoading(true);
            const data = await documentoService.getTrashedDocumentos();
            setDocumentos(data);
        } catch (error) {
            console.error(error);
            addToast('Error al cargar la papelera', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadTrashed(); }, []);

    const handleSelectAll = (checked: boolean, filteredDocs: Documento[]) => {
        setSelectedIds(checked ? filteredDocs.map(d => d.id) : []);
    };

    const handleSelect = (id: number) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const handleRestore = async () => {
        if (selectedIds.length === 0) return;
        try {
            setLoading(true);
            await documentoService.restoreDocumentos(selectedIds);
            addToast(`Se restauraron ${selectedIds.length} documento(s) exitosamente.`, 'success');
            setDocumentos(prev => prev.filter(d => !selectedIds.includes(d.id)));
            setSelectedIds([]);
        } catch (error) {
            console.error(error);
            addToast('Error al restaurar los documentos', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleForceDelete = async () => {
        if (selectedIds.length === 0) return;
        try {
            setLoading(true);
            await documentoService.forceDeleteDocumentos(selectedIds);
            addToast(`Se destruyeron ${selectedIds.length} documento(s) definitivamente.`, 'success');
            setDocumentos(prev => prev.filter(d => !selectedIds.includes(d.id)));
            setSelectedIds([]);
            setShowConfirm(false);
        } catch (error) {
            console.error(error);
            addToast('Error al destruir los documentos', 'error');
        } finally {
            setLoading(false);
        }
    };

    return {
        documentos,
        loading,
        selectedIds,
        showConfirm,
        setShowConfirm,
        handleSelectAll,
        handleSelect,
        handleRestore,
        handleForceDelete,
    };
}
