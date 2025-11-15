import React from 'react';
import { UserDropdown } from './UserDropdown';

interface HeaderProps {
    userName?: string;
    onLogout?: () => void;
    showActions?: boolean;
    onNavigateToSettings?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ userName, onLogout, showActions = true, onNavigateToSettings }) => {

    return (
        <header className="shadow-lg fixed top-0 right-0 left-32 z-10" style={{ backgroundColor: '#FF9411' }}>
            <div className="pr-4 sm:pr-6 lg:pr-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <div className="flex items-center">
                        <img
                            src="/Asconfit.png"
                            alt="Asconfit Logo"
                            className="h-10 w-auto"
                        />
                    </div>

                    {/* Actions */}
                    {showActions && (
                        <div className="flex items-center space-x-4">
                            {/* Email Icon */}
                            <button className="p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition duration-150">
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

                            {/* Notification Icon */}
                            <button className="p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition duration-150">
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
                                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                                    />
                                </svg>
                            </button>

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
