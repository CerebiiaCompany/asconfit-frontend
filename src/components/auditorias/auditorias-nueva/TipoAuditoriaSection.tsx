import React from 'react';

interface TipoAuditoriaSectionProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const TipoAuditoriaSection: React.FC<TipoAuditoriaSectionProps> = ({ value, onChange }) => {
    return (
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <label className="text-sm text-gray-600 sm:w-44 flex-shrink-0">Tipo de Auditoría:</label>
            <input
                type="text"
                name="tipoAuditoria"
                value={value}
                onChange={onChange}
                placeholder="Ej: Financiera, Gestión, Tributaria, etc."
                className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-[#F3F3F3] text-sm sm:text-base"
            />
        </div>
    );
};
