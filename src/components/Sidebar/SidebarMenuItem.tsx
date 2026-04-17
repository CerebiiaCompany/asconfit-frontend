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
                {item.id === 'ai-analysis' ? (
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="28" 
                        height="28" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="white" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeOpacity="0.7"
                        className="mb-1.5 shrink-0"
                    >
                        <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"></path>
                        <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"></path>
                        <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"></path>
                        <path d="M17.599 6.5a3 3 0 0 0 .399-1.375"></path>
                        <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"></path>
                        <path d="M3.477 10.896a4 4 0 0 1 .585-.396"></path>
                        <path d="M19.938 10.5a4 4 0 0 1 .585.396"></path>
                        <path d="M6 18a4 4 0 0 1-1.967-.516"></path>
                        <path d="M19.967 17.484A4 4 0 0 1 18 18"></path>
                    </svg>
                ) : (
                    <img
                        src={item.icon}
                        alt={item.label}
                        className="w-7 h-7 mb-1.5 object-contain"
                    />
                )}
                <span className="text-white text-xs font-medium text-center">
                    {item.label}
                </span>
            </button>
        </li>
    );
};
