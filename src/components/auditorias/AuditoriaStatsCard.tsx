import React from 'react';

interface AuditoriaStatsCardProps {
    title: string;
    value: number;
    icon: React.ReactNode;
    borderColor: string;
    bgColor: string;
    iconColor: string;
}

export const AuditoriaStatsCard: React.FC<AuditoriaStatsCardProps> = ({
    title,
    value,
    icon,
    borderColor,
    bgColor,
    iconColor
}) => {
    return (
        <div className={`bg-white shadow-lg rounded-xl p-6 border-l-4 ${borderColor}`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                </div>
                <div className={`${bgColor} rounded-lg p-3`}>
                    <div className={iconColor}>
                        {icon}
                    </div>
                </div>
            </div>
        </div>
    );
};
