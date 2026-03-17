import React from 'react';

interface EstadoInformacionBadgeProps {
    estado?: string;
}

export const EstadoInformacionBadge: React.FC<EstadoInformacionBadgeProps> = ({ estado }) => {
    if (!estado) {
        return <span className="text-sm text-gray-400">-</span>;
    }

    const badgeClass =
        estado === 'aprobado' ? 'bg-green-100 text-green-800' :
            estado === 'rechazado' ? 'bg-red-100 text-red-700' :
                'bg-gray-100 text-gray-500';

    const label =
        estado === 'aprobado' ? 'Aprobado' :
            estado === 'rechazado' ? 'Rechazado' :
                estado.charAt(0).toUpperCase() + estado.slice(1);

    return (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${badgeClass}`}>
            {label}
        </span>
    );
};
