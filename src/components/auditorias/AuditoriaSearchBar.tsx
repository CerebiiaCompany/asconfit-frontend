import React from 'react';

interface AuditoriaSearchBarProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    onNewAuditoria: () => void;
}

export const AuditoriaSearchBar: React.FC<AuditoriaSearchBarProps> = ({
    searchTerm,
    onSearchChange,
    onNewAuditoria
}) => {
    return (
        <div className="bg-white shadow-lg rounded-xl p-6 mb-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1 w-full">
                    <input
                        type="text"
                        placeholder="Buscar auditorías..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <button
                    onClick={onNewAuditoria}
                    className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Nueva Auditoría
                </button>
            </div>
        </div>
    );
};
