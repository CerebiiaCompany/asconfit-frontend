import React from 'react';
import { MenuItem } from '../../config/menuConfig';

interface SidebarMenuItemProps {
    item: MenuItem;
    isActive: boolean;
    onClick: () => void;
}

export const SidebarMenuItem: React.FC<SidebarMenuItemProps> = ({ item, isActive, onClick }) => {
    return (
        <li>
            <button
                onClick={onClick}
                className={`w-full flex flex-col items-center justify-center py-4 px-2 transition-colors duration-200 ${isActive
                        ? 'bg-gray-700 border-l-4'
                        : 'hover:bg-gray-700'
                    }`}
                style={isActive ? { borderLeftColor: '#FF9411' } : {}}
            >
                <img
                    src={item.icon}
                    alt={item.label}
                    className="w-7 h-7 mb-1.5 object-contain"
                />
                <span className="text-white text-xs font-medium text-center">
                    {item.label}
                </span>
            </button>
        </li>
    );
};
