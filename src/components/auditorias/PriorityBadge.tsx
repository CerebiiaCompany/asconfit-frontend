import React from 'react';

interface PriorityBadgeProps {
    prioridad?: string;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ prioridad }) => {
    if (!prioridad) {
        return <span className="text-sm text-gray-400">-</span>;
    }

    const badgeClass =
        prioridad === 'alta' ? 'bg-red-100 text-red-800' :
            prioridad === 'media' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800';

    return (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${badgeClass}`}>
            {prioridad.charAt(0).toUpperCase() + prioridad.slice(1)}
        </span>
    );
};
