import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface SidebarProps {
    onLogout: () => void;
    isOpen?: boolean;
    onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onLogout, isOpen = true, onClose }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        {
            id: 'dashboard',
            path: '/dashboard',
            label: 'Inicio',
            icon: '/dashboard.png',
        },
        {
            id: 'auditorias',
            path: '/auditorias',
            label: 'Auditorias',
            icon: '/search.png',
        },
        {
            id: 'mis-tareas',
            path: '/mis-tareas',
            label: 'Mis Tareas',
            icon: '/search.png',
        },
        {
            id: 'empresas',
            path: '/empresas',
            label: 'Empresas',
            icon: '/building.png',
        },
        {
            id: 'perfil',
            path: '/perfil',
            label: 'Perfil',
            icon: '/profile.png',
        },
    ];

    const isActive = (path: string) => {
        if (location.pathname === path) return true;
        // Mantener activo "Auditorías" en rutas relacionadas
        if (path === '/auditorias' && location.pathname.startsWith('/auditorias/')) return true;
        // Mantener activo "Mis Tareas" en rutas relacionadas
        if (path === '/mis-tareas' && location.pathname.startsWith('/mis-tareas/')) return true;
        return false;
    };

    return (
        <>
            {/* Overlay para móvil */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`w-32 h-screen flex flex-col fixed left-0 top-0 z-40 transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
                style={{ backgroundColor: '#2D3748' }}
            >
                {/* Logo Section */}
                <div className="h-20 flex items-center justify-center border-b border-gray-700 relative" style={{ backgroundColor: '#FF9411' }}>
                    {/* Botón cerrar en móvil */}
                    <button
                        onClick={onClose}
                        className="lg:hidden p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition duration-150"
                    >
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Menu Items */}
                <nav className="flex-1 py-4 overflow-y-auto">
                    <ul className="space-y-1">
                        {menuItems.map((item) => (
                            <li key={item.id}>
                                <button
                                    onClick={() => {
                                        navigate(item.path);
                                        onClose?.();
                                    }}
                                    className={`w-full flex flex-col items-center justify-center py-4 px-2 transition-colors duration-200 ${isActive(item.path)
                                        ? 'bg-gray-700 border-l-4'
                                        : 'hover:bg-gray-700'
                                        }`}
                                    style={isActive(item.path) ? { borderLeftColor: '#FF9411' } : {}}
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
                        ))}
                    </ul>
                </nav>

                {/* Logout Button */}
                <div className="p-3 border-t border-gray-700">
                    <button
                        onClick={() => {
                            onLogout();
                            onClose?.();
                        }}
                        className="w-full flex flex-col items-center justify-center py-3 px-2 hover:bg-gray-700 transition-colors duration-200 rounded-lg"
                    >
                        <img
                            src="/Sign_out.png"
                            alt="Cerrar sesión"
                            className="w-7 h-7 mb-1.5 object-contain"
                        />
                        <span className="text-white text-xs font-medium text-center">
                            Cerrar sesión
                        </span>
                    </button>
                </div>
            </aside>
        </>
    );
};
