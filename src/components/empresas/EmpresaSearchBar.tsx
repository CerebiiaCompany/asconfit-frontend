import React from 'react';
import { SearchInput } from '../SearchInput';

interface EmpresaSearchBarProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    onNewEmpresa: () => void;
}

export const EmpresaSearchBar: React.FC<EmpresaSearchBarProps> = ({
    searchTerm,
    onSearchChange,
    onNewEmpresa
}) => {
    return (
        <div className="bg-white shadow-lg rounded-xl p-6 mb-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <SearchInput
                    value={searchTerm}
                    onChange={onSearchChange}
                    placeholder="Buscar empresas..."
                    className="flex-1 w-full"
                />
                <button
                    onClick={onNewEmpresa}
                    className="w-full sm:w-auto px-6 py-2 text-white rounded-lg hover:opacity-90 transition-colors flex items-center justify-center gap-2"
                    style={{ backgroundColor: '#FF9411' }}
                >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Crear Empresa
                </button>
            </div>
        </div>
    );
};
