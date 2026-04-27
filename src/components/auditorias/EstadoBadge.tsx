import React from 'react';

interface EstadoBadgeProps {
    estado: string;
}

export const EstadoBadge: React.FC<EstadoBadgeProps> = ({ estado }) => {
    const badges: Record<string, string> = {
        pendiente: 'bg-red-100 text-red-800',
        en_progreso: 'bg-yellow-100 text-yellow-800',
        completada: 'bg-green-100 text-green-800',
        aprobado: 'bg-green-100 text-green-800',
        rechazado: 'bg-red-100 text-red-800'
    };

    const labels: Record<string, string> = {
        pendiente: 'Pendiente',
        en_progreso: 'En Progreso',
        completada: 'Completada',
        aprobado: 'Aprobado',
        rechazado: 'Rechazado'
    };

    return (
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${badges[estado] || 'bg-gray-100 text-gray-800'}`}>
            {labels[estado] || estado}
        </span>
    );
};
