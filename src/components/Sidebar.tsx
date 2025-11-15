import React from 'react';

interface SidebarProps {
    onLogout: () => void;
    activeView: string;
    onNavigate: (view: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onLogout, activeView, onNavigate }) => {

    const menuItems = [
        {
            id: 'inicio',
            label: 'Inicio',
            icon: '/dashboard.png',
        },
        {
            id: 'auditorias',
            label: 'Auditorias',
            icon: '/search.png',
        },
        {
            id: 'empresas',
            label: 'Empresas',
            icon: '/building.png',
        },
        {
            id: 'perfil',
            label: 'Perfil',
            icon: '/profile.png',
        },
    ];

    return (
        <aside className="w-32 h-screen flex flex-col fixed left-0 top-0 z-20" style={{ backgroundColor: '#2D3748' }}>
            {/* Logo Section */}
            <div className="h-20 flex items-center justify-center border-b border-gray-700" style={{ backgroundColor: '#FF9411' }}>

            </div>

            {/* Menu Items */}
            <nav className="flex-1 py-4 overflow-y-auto">
                <ul className="space-y-1">
                    {menuItems.map((item) => (
                        <li key={item.id}>
                            <button
                                onClick={() => onNavigate(item.id)}
                                className={`w-full flex flex-col items-center justify-center py-4 px-2 transition-colors duration-200 ${activeView === item.id
                                    ? 'bg-gray-700 border-l-4'
                                    : 'hover:bg-gray-700'
                                    }`}
                                style={activeView === item.id ? { borderLeftColor: '#FF9411' } : {}}
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
                    onClick={onLogout}
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
    );
};
