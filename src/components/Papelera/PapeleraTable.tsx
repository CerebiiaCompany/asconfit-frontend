import React from 'react';
import { Documento } from '../../services/documentoService';

interface PapeleraTableProps {
    docs: Documento[];
    loading: boolean;
    selectedIds: number[];
    onSelectAll: (checked: boolean) => void;
    onSelect: (id: number) => void;
}

const Checkbox: React.FC<{ checked: boolean; onChange: () => void }> = ({ checked, onChange }) => (
    <label className="relative flex items-center cursor-pointer group" onClick={e => e.stopPropagation()}>
        <input type="checkbox" className="sr-only" checked={checked} onChange={onChange} />
        <div className={`w-6 h-6 border-2 rounded-md transition-all duration-200 flex items-center justify-center ${checked ? 'bg-orange-500 border-orange-500' : 'bg-white border-gray-300 group-hover:border-orange-400'}`}>
            {checked && (
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
            )}
        </div>
    </label>
);

export const PapeleraTable: React.FC<PapeleraTableProps> = ({
    docs, loading, selectedIds, onSelectAll, onSelect,
}) => {
    if (loading && docs.length === 0) {
        return (
            <div className="py-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto" />
                <p className="mt-4 text-gray-500">Cargando documentos...</p>
            </div>
        );
    }

    if (!loading && docs.length === 0) {
        return (
            <div className="py-16 text-center">
                <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <p className="text-gray-400 font-medium">No hay documentos en la papelera</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {/* Seleccionar todos */}
            <div className="flex items-center gap-3 px-2 pb-2 border-b border-gray-100">
                <Checkbox
                    checked={docs.length > 0 && selectedIds.length === docs.length}
                    onChange={() => onSelectAll(selectedIds.length !== docs.length)}
                />
                <span className="text-sm text-gray-500 font-medium">Seleccionar todos</span>
            </div>

            {docs.map(item => {
                const selected = selectedIds.includes(item.id);
                const ruta = item.ruta_carpeta || (item.carpeta?.nombre ? `/${item.carpeta.nombre}` : null);
                return (
                    <div key={item.id}
                        onClick={() => onSelect(item.id)}
                        className={`bg-white border rounded-xl p-5 hover:shadow-md transition-all cursor-pointer ${selected ? 'border-orange-400 bg-orange-50/30' : 'border-gray-200'}`}
                    >
                        <div className="flex items-start gap-4">
                            <Checkbox checked={selected} onChange={() => onSelect(item.id)} />
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="md:col-span-2">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-red-500 font-black text-xs px-2 py-0.5 bg-red-50 rounded-md border border-red-100 flex-shrink-0">
                                            {(item.extension || '').toUpperCase()}
                                        </span>
                                        <h3 className="text-base font-semibold text-gray-900 truncate">{item.nombre_original}</h3>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div>
                                            <span className="text-gray-500">Empresa:</span>
                                            <span className="ml-2 font-medium text-gray-700">{item.carpeta?.empresa?.razon_social || '—'}</span>
                                        </div>
                                        {ruta && (
                                            <div>
                                                <span className="text-gray-500">Ubicación:</span>
                                                <span className="ml-2 font-medium text-gray-700 truncate">{ruta}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-start justify-end">
                                    <div className="text-right">
                                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg font-semibold text-sm bg-gray-100 text-gray-600">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {item.deleted_at ? new Date(item.deleted_at).toLocaleDateString('es-ES') : '—'}
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1.5">Fecha de eliminación</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
