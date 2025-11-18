import React from 'react';

interface SidebarHeaderProps {
    onClose?: () => void;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({ onClose }) => {
    return (
        <div
            className="h-20 flex items-center justify-center border-b border-gray-700 relative"
            style={{ backgroundColor: '#FF9411' }}
        >
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
    );
};
