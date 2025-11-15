import React from 'react';
import { SearchInput } from '../SearchInput';

interface AuditoriaHeaderProps {
    searchEmpresa: string;
    searchConcepto: string;
    onSearchEmpresaChange: (value: string) => void;
    onSearchConceptoChange: (value: string) => void;
    onBack: () => void;
}

export const AuditoriaHeader: React.FC<AuditoriaHeaderProps> = ({
    searchEmpresa,
    searchConcepto,
    onSearchEmpresaChange,
    onSearchConceptoChange,
    onBack
}) => {
    return (
        <div className="bg-white shadow-xl rounded-2xl mb-8 p-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={onBack}
                        className="text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h1 className="text-3xl font-bold text-gray-800">Nueva Auditoría</h1>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">Empresa</span>
                        <SearchInput
                            value={searchEmpresa}
                            onChange={onSearchEmpresaChange}
                            placeholder="Buscar..."
                            className="w-64"
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">Visita de:</span>
                        <SearchInput
                            value={searchConcepto}
                            onChange={onSearchConceptoChange}
                            placeholder="Concepto de visita..."
                            className="w-64"
                        />
                    </div>
                    <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};
