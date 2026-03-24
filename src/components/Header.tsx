import React from "react";
import { UserDropdown } from "./UserDropdown";
import { NotificationDropdown } from "./NotificationDropdown";
import { useNotificationContext } from "../contexts/NotificationContext";

import { User } from "../services/authService";
import { UserRole } from "../config/menuConfig";

interface HeaderProps {
  user: User | null;
  userRole: UserRole | null;
  onLogout?: () => void;
  showActions?: boolean;
  onNavigateToSettings?: () => void;
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  userRole,
  onLogout,
  showActions = true,
  onNavigateToSettings,
  onToggleSidebar,
}) => {
  const {
    notifications,
    handleMarkAsRead,
    handleMarkAllAsRead,
    handleClearAll,
  } = useNotificationContext();

  return (
    <header
      className="shadow-lg fixed top-0 right-0 left-0 z-50"
      style={{ backgroundColor: "#FF9411" }}
    >
      <div className="px-4 sm:px-6 lg:px-8">
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
              {/* Notification Dropdown */}
              <NotificationDropdown
                notifications={notifications}
                onMarkAsRead={handleMarkAsRead}
                onMarkAllAsRead={handleMarkAllAsRead}
                onClearAll={handleClearAll}
              />
              {user && (
                <div
                  className="flex items-center space-x-4 transition-all duration-300 cursor-pointer"
                  onClick={onNavigateToSettings}
                >
                  <div className="w-12 h-12 rounded-full border-2 border-[#1A202C]/20 flex items-center justify-center overflow-hidden bg-white/10 shadow-sm">
                    {user.profile_photo_path ? (
                      <img
                        src={`http://localhost:8000/storage/${user.profile_photo_path}`}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <svg
                        className="w-7 h-7 text-white opacity-90"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <span className="text-[#1A202C] font-medium text-lg leading-none mb-0.5 lowercase">
                      {user.name}
                    </span>
                    <span className="text-white text-base capitalize font-normal opacity-90">
                      {user.role?.nombre || userRole}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
