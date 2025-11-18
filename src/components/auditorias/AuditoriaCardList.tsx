import React from 'react';
import { Auditoria } from '../../types/auditoria';
import { AuditoriaCard } from './AuditoriaCard';

interface AuditoriaCardListProps {
    auditorias: Auditoria[];
    onViewAuditoria: (id: number) => void;
}

export const AuditoriaCardList: React.FC<AuditoriaCardListProps> = ({
    auditorias,
    onViewAuditoria
}) => {
    return (
        <div className="space-y-3 sm:space-y-4">
            {/* Header - Hidden on mobile */}
            <div className="hidden lg:grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="col-span-1 text-xs font-medium text-gray-500 uppercase">
                    Select.
                </div>
                <div className="col-span-2 text-xs font-medium text-gray-500 uppercase">
                    NIT
                </div>
                <div className="col-span-2 text-xs font-medium text-gray-500 uppercase">
                    Razón social
                </div>
                <div className="col-span-2 text-xs font-medium text-gray-500 uppercase">
                    Visita de:
                </div>
                <div className="col-span-2 text-xs font-medium text-gray-500 uppercase">
                    Corte
                </div>
                <div className="col-span-3 text-xs font-medium text-gray-500 uppercase">
                    Proceso
                </div>
            </div>

            {/* Cards */}
            {auditorias.map((auditoria) => (
                <AuditoriaCard
                    key={auditoria.id}
                    auditoria={auditoria}
                    onViewComplete={onViewAuditoria}
                />
            ))}
        </div>
    );
};
