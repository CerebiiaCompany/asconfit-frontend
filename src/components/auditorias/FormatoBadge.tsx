import React from 'react';

interface FormatoBadgeProps {
    formato?: string;
}

export const FormatoBadge: React.FC<FormatoBadgeProps> = ({ formato }) => {
    if (!formato) {
        return <span className="text-sm text-gray-400">-</span>;
    }

    return (
        <span className="px-2 py-1 text-xs font-semibold rounded bg-orange-100 text-orange-800">
            {formato.toUpperCase()}
        </span>
    );
};
