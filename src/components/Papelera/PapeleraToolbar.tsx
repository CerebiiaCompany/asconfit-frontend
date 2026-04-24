import React from 'react';
import { SearchInput } from '../SearchInput';

interface PapeleraToolbarProps {
    searchTerm: string;
    onSearchChange: (v: string) => void;
    selectedCount: number;
    loading: boolean;
    onDestruir: () => void;
    onRestaurar: () => void;
}

export const PapeleraToolbar: React.FC<PapeleraToolbarProps> = ({
    searchTerm, onSearchChange, selectedCount, loading, onDestruir, onRestaurar,
}) => (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <SearchInput
            value={searchTerm}
            onChange={onSearchChange}
            placeholder="Buscar por nombre, empresa..."
            className="w-full sm:w-80"
        />
        <div className="flex gap-2 sm:gap-4">
            <button
                disabled={selectedCount === 0 || loading}
                onClick={onDestruir}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-6 py-2 border border-red-500 text-red-600 bg-white rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span className="font-medium">Destruir ({selectedCount})</span>
            </button>
            <button
                disabled={selectedCount === 0 || loading}
                onClick={onRestaurar}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-6 py-2 bg-[#FF9411] text-white rounded-lg hover:opacity-90 transition-opacity shadow-sm disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
                <span className="font-semibold">Restaurar ({selectedCount})</span>
            </button>
        </div>
    </div>
);
