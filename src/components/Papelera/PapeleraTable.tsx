import React from 'react';
import { Documento } from '../../services/documentoService';

interface PapeleraTableProps {
    docs: Documento[];
    loading: boolean;
    selectedIds: number[];
    onSelectAll: (checked: boolean) => void;
    onSelect: (id: number) => void;
}

export const PapeleraTable: React.FC<PapeleraTableProps> = ({
    docs, loading, selectedIds, onSelectAll, onSelect,
}) => (
    <div className="hidden sm:block overflow-x-auto overflow-y-auto max-h-[500px] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-[#FF9411] [&::-webkit-scrollbar-thumb]:rounded-full pr-2">
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="sticky top-0 bg-white z-10">
                <tr>
                    <th className="px-6 py-4 text-left border-t border-b border-gray-200 w-24">
                        <div className="flex items-center gap-1">
                            <input
                                type="checkbox"
                                className="w-4 h-4 text-[#FF9411] border-gray-300 rounded focus:ring-[#FF9411] cursor-pointer"
                                onChange={e => onSelectAll(e.target.checked)}
                                checked={docs.length > 0 && selectedIds.length === docs.length}
                            />
                            <span className="ml-2 text-sm font-medium text-gray-600">Todos</span>
                        </div>
                    </th>
                    {['Nombre', 'Empresa', 'Ubicación original', 'Fecha de eliminación'].map(h => (
                        <th key={h} className="px-6 py-4 text-left border-t border-b border-gray-200">
                            <span className="text-sm font-medium text-gray-600">{h}</span>
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody className="bg-white">
                {loading && docs.length === 0 && (
                    <tr><td colSpan={5} className="py-8 text-center text-gray-500 font-medium">Cargando papelera...</td></tr>
                )}
                {!loading && docs.length === 0 && (
                    <tr><td colSpan={5} className="py-8 text-center text-gray-500 font-medium">La papelera está vacía.</td></tr>
                )}
                {docs.map(item => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-5 whitespace-nowrap">
                            <input
                                type="checkbox"
                                className="w-4 h-4 text-[#FF9411] border-gray-300 rounded focus:ring-[#FF9411] cursor-pointer"
                                checked={selectedIds.includes(item.id)}
                                onChange={() => onSelect(item.id)}
                            />
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                            <span className="text-[15px] font-bold text-gray-900 flex items-center gap-3">
                                <span className="text-red-500 font-black text-xs px-2 py-0.5 bg-red-50 rounded-md border border-red-100">
                                    {(item.extension || '').toUpperCase()}
                                </span>
                                {item.nombre_original}
                            </span>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                            <span className="text-[15px] text-gray-600 font-medium">{item.carpeta?.empresa?.razon_social || 'N/A'}</span>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                            <span className="text-[15px] text-gray-600 font-medium bg-gray-100 px-3 py-1 rounded-full text-sm">
                                {item.carpeta?.nombre ? `/${item.carpeta.nombre}` : 'N/A'}
                            </span>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                            <span className="text-[15px] text-gray-500 font-semibold block">
                                {item.deleted_at ? new Date(item.deleted_at).toLocaleString() : ''}
                            </span>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);
