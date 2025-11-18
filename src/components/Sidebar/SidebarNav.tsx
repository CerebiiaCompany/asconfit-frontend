import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MenuItem } from '../../config/menuConfig';
import { SidebarMenuItem } from './SidebarMenuItem';

interface SidebarNavProps {
    menuItems: MenuItem[];
    onClose?: () => void;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({ menuItems, onClose }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path: string): boolean => {
        if (location.pathname === path) return true;
        // Mantener activo en rutas relacionadas
        if (path === '/auditorias' && location.pathname.startsWith('/auditorias/')) return true;
        if (path === '/mis-tareas' && location.pathname.startsWith('/mis-tareas/')) return true;
        return false;
    };

    const handleItemClick = (path: string) => {
        navigate(path);
        onClose?.();
    };

    return (
        <nav className="flex-1 py-4 overflow-y-auto">
            <ul className="space-y-1">
                {menuItems.map((item) => (
                    <SidebarMenuItem
                        key={item.id}
                        item={item}
                        isActive={isActive(item.path)}
                        onClick={() => handleItemClick(item.path)}
                    />
                ))}
            </ul>
        </nav>
    );
};
