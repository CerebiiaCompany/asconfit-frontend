import React from 'react';

interface SidebarFooterProps {
    onLogout: () => void;
    onClose?: () => void;
}

export const SidebarFooter: React.FC<SidebarFooterProps> = ({ onLogout, onClose }) => {
    const handleLogout = () => {
        onLogout();
        onClose?.();
    };

    return (
        <div className="p-3 border-t border-gray-700">
            <button
                onClick={handleLogout}
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
    );
};
