import { useState } from 'react';
import { AuditoriaFormData, Categoria } from '../types/auditoria.types';

const initialFormData: AuditoriaFormData = {
    empresa: '',
    nit: '',
    razonSocial: '',
    actividadEconomica: '',
    direccion: '',
    responsable: '',
    contacto: '',
    pt: '',
    fechaInicial: '',
    fechaCorte: ''
};

export const useAuditoriaForm = () => {
    const [formData, setFormData] = useState<AuditoriaFormData>(initialFormData);
    const [categorias, setCategorias] = useState<Categoria[]>([
        { id: '1', nombre: '' }
    ]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddCategoria = () => {
        setCategorias(prev => [...prev, { id: Date.now().toString(), nombre: '' }]);
    };

    const handleRemoveCategoria = (id: string) => {
        setCategorias(prev => prev.filter(cat => cat.id !== id));
    };

    const handleCategoriaChange = (id: string, value: string) => {
        setCategorias(prev => prev.map(cat =>
            cat.id === id ? { ...cat, nombre: value } : cat
        ));
    };

    return {
        formData,
        categorias,
        handleInputChange,
        handleAddCategoria,
        handleRemoveCategoria,
        handleCategoriaChange
    };
};
