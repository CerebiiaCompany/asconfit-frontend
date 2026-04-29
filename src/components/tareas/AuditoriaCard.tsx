import React from 'react';
import { AuditoriaAgrupada } from '../../hooks/useTareas';

interface AuditoriaCardProps {
    auditoria: AuditoriaAgrupada;
    onClick: () => void;
}

export const AuditoriaCard: React.FC<AuditoriaCardProps> = ({ auditoria, onClick }) => {
    return (
        <div
            onClick={onClick}
            className="border border-gray-200 rounded-lg p-6 hover:shadow-lg hover:border-orange-300 transition-all cursor-pointer group"
        >
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <svg className="h-5 w-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <div className="flex-1">
                            <h3 className="font-semibold text-gray-800 group-hover:text-orange-600 transition-colors">
                                {auditoria.empresa}
                            </h3>
                            {auditoria.tipoAuditoria && (
                                <p className="text-sm text-gray-500 mt-0.5">
                                    {auditoria.tipoAuditoria}
                                </p>
                            )}
                        </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                        NIT: {auditoria.nit}
                    </p>
                </div>
                <svg className="h-5 w-5 text-gray-400 group-hover:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className="text-sm text-gray-500">
                    {auditoria.tareas.length} {auditoria.tareas.length === 1 ? 'Encargo' : 'Encargos'}
                </span>
                <span className="text-xs text-orange-600 font-medium">
                    Ver encargos →
                </span>
            </div>
        </div>
    );
};
