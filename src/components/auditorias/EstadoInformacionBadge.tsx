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
            estado === 'recibido' ? 'bg-blue-100 text-blue-800' :
                estado === 'revision' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800';

    return (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${badgeClass}`}>
            {estado.charAt(0).toUpperCase() + estado.slice(1)}
        </span>
    );
};
