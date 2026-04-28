import React from 'react';
import { Documento } from '../../services/documentoService';

interface PapeleraCardsProps {
    docs: Documento[];
    loading: boolean;
    selectedIds: number[];
    onSelectAll: (checked: boolean) => void;
    onSelect: (id: number) => void;
}

export const PapeleraCards: React.FC<PapeleraCardsProps> = ({
    docs, loading, selectedIds, onSelectAll, onSelect,
}) => (
    <div className="sm:hidden">
        {docs.length > 0 && (
            <label className="flex items-center gap-3 px-1 py-3 border-b border-gray-100 mb-2 cursor-pointer group">
                <input
                    type="checkbox"
                    className="sr-only peer"
                    onChange={e => onSelectAll(e.target.checked)}
                    checked={docs.length > 0 && selectedIds.length === docs.length}
                />
                <div className={`w-6 h-6 border-2 rounded-md transition-all duration-200 flex items-center justify-center ${docs.length > 0 && selectedIds.length === docs.length
                    ? 'bg-orange-500 border-orange-500'
                    : 'bg-white border-gray-300 group-hover:border-orange-400'
                    }`}>
                    {docs.length > 0 && selectedIds.length === docs.length && (
                        <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    )}
                </div>
                <span className="text-sm font-medium text-gray-600">Seleccionar todos</span>
            </label>
        )}
        {loading && docs.length === 0 && <p className="py-8 text-center text-gray-500 font-medium">Cargando papelera...</p>}
        {!loading && docs.length === 0 && <p className="py-8 text-center text-gray-500 font-medium">La papelera está vacía.</p>}
        <div className="flex flex-col gap-3">
            {docs.map(item => (
                <label
                    key={item.id}
                    className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${selectedIds.includes(item.id) ? 'border-[#FF9411] bg-orange-50' : 'border-gray-100 bg-gray-50'
                        }`}
                >
                    <div className="relative flex items-center group">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={selectedIds.includes(item.id)}
                            onChange={() => onSelect(item.id)}
                        />
                        <div className={`w-6 h-6 border-2 rounded-md transition-all duration-200 flex items-center justify-center ${selectedIds.includes(item.id)
                            ? 'bg-orange-500 border-orange-500'
                            : 'bg-white border-gray-300 group-hover:border-orange-400'
                            }`}>
                            {selectedIds.includes(item.id) && (
                                <svg
                                    className="w-4 h-4 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                        </div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-red-500 font-black text-xs px-2 py-0.5 bg-red-50 rounded-md border border-red-100 flex-shrink-0">
                                {(item.extension || '').toUpperCase()}
                            </span>
                            <span className="text-sm font-bold text-gray-900 truncate">{item.nombre_original}</span>
                        </div>
                        <p className="text-xs text-gray-500">{item.carpeta?.empresa?.razon_social || 'N/A'}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                            {item.ruta_carpeta || (item.carpeta?.nombre ? `/${item.carpeta.nombre}` : 'N/A')}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">{item.deleted_at ? new Date(item.deleted_at).toLocaleString() : ''}</p>
                    </div>
                </label>
            ))}
        </div>
    </div>
);
