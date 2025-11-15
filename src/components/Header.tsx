import React from 'react';
import { UserDropdown } from './UserDropdown';
import { NotificationDropdown } from './NotificationDropdown';
import { useNotifications } from '../hooks/useNotifications';

interface HeaderProps {
    userName?: string;
    onLogout?: () => void;
    showActions?: boolean;
    onNavigateToSettings?: () => void;
    onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
    userName,
    onLogout,
    showActions = true,
    onNavigateToSettings,
    onToggleSidebar
}) => {
    const { notifications, handleMarkAsRead, handleMarkAllAsRead, handleClearAll } = useNotifications();

    return (
        <header className="shadow-lg fixed top-0 right-0 lg:left-32 left-0 z-10" style={{ backgroundColor: '#FF9411' }}>
            <div className="px-4 sm:px-6 lg:pr-8 lg:pl-0">
                <div className="flex justify-between items-center h-20">
                    {/* Hamburger Menu + Logo */}
                    <div className="flex items-center space-x-2 sm:space-x-3">
                        {/* Botón Hamburguesa (solo móvil) */}
                        <button
                            onClick={onToggleSidebar}
                            className="lg:hidden p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition duration-150 flex-shrink-0"
                        >
                            <svg
                                className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        </button>

                        {/* Logo */}
                        <img
                            src="/Asconfit.png"
                            alt="Asconfit Logo"
                            className="h-8 sm:h-10 w-auto"
                        />
                    </div>

                    {/* Actions */}
                    {showActions && (
                        <div className="flex items-center space-x-2 sm:space-x-4">
                            {/* Email Icon */}
                            <button className="p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition duration-150 flex-shrink-0">
                                <svg
                                    className="w-5 h-5 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                    />
                                </svg>
                            </button>

                            {/* Notification Dropdown */}
                            <NotificationDropdown
                                notifications={notifications}
                                onMarkAsRead={handleMarkAsRead}
                                onMarkAllAsRead={handleMarkAllAsRead}
                                onClearAll={handleClearAll}
                            />

                            {/* User Menu */}
                            {userName && onLogout && (
                                <UserDropdown
                                    userName={userName}
                                    onLogout={onLogout}
                                    onNavigateToSettings={onNavigateToSettings}
                                />
                            )}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};
