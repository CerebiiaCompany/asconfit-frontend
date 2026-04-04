import React from 'react';

interface CompanyStatsCardProps {
    title: string;
    value: number;
    icon: React.ReactNode;
    color: 'green' | 'blue' | 'yellow' | 'gray';
}

const colorClasses = {
    green: {
        border: 'border-green-600',
        bg: 'bg-green-100',
        text: 'text-green-600'
    },
    blue: {
        border: 'border-blue-600',
        bg: 'bg-blue-100',
        text: 'text-blue-600'
    },
    yellow: {
        border: 'border-yellow-600',
        bg: 'bg-yellow-100',
        text: 'text-yellow-600'
    },
    gray: {
        border: 'border-gray-600',
        bg: 'bg-gray-100',
        text: 'text-gray-600'
    }
};

export const CompanyStatsCard: React.FC<CompanyStatsCardProps> = ({ title, value, icon, color }) => {
    const colors = colorClasses[color];

    return (
        <div className={`bg-white shadow-lg rounded-xl p-6 border-l-4 ${colors.border}`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                </div>
                <div className={`${colors.bg} rounded-lg p-3`}>
                    <div className={`h-6 w-6 ${colors.text}`}>
                        {icon}
                    </div>
                </div>
            </div>
        </div>
    );
};
