import React from "react";
import { useNavigate } from "react-router-dom";

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type?: "info" | "warning" | "success" | "error";
  tipo?: string;
  auditoria_id?: number | null;
  subtarea_id?: number | null;
}

interface NotificationDropdownProps {
  notifications?: Notification[];
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
  onClearAll?: () => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  notifications = [],
  onMarkAsRead,
  onMarkAllAsRead,
  onClearAll,
}) => {
  const [showNotifications, setShowNotifications] = React.useState(false);
  const navigate = useNavigate();
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      onMarkAsRead?.(notification.id);
    }

    // Navegar según el tipo de notificación
    // archivo_subido es para admin (cuando alguien sube archivo, admin recibe notificación)
    // Los demás son para usuarios delegados
    if (notification.auditoria_id) {
      if (notification.tipo === 'archivo_subido') {
        navigate(`/auditorias/${notification.auditoria_id}`);
      } else {
        navigate(`/mis-tareas?auditoria_id=${notification.auditoria_id}`);
      }
    }
    setShowNotifications(false);
  };

  const getNotificationIcon = (type?: string) => {
    const colorClass =
      type === "success"
        ? "text-green-500"
        : type === "error"
          ? "text-red-500"
          : type === "warning"
            ? "text-yellow-500"
            : "text-blue-500";

    return (
      <svg
        className={`w-4 h-4 ${colorClass}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
      </svg>
    );
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="w-12 h-12 flex items-center justify-center rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition duration-150 relative"
      >
        <svg
          className="w-7 h-7 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {showNotifications && (
        <>
          {/* Overlay para cerrar el menú al hacer clic fuera */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowNotifications(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-xl z-20 max-h-96 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">Notificaciones</h3>
              {notifications.length > 0 && (
                <button
                  onClick={() => {
                    onMarkAllAsRead?.();
                  }}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  Marcar todas como leídas
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto flex-1">
              {notifications.length === 0 ? (
                <div className="px-4 py-8 text-center text-gray-500">
                  <svg
                    className="w-12 h-12 mx-auto mb-3 text-gray-300"
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
                  <p className="text-sm">No tienes notificaciones</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`px-3 py-1.5 border-b border-gray-100 hover:bg-gray-50 transition duration-150 cursor-pointer ${
                      !notification.read ? "bg-blue-50" : ""
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start space-x-2">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-xs font-medium text-gray-900 ${!notification.read ? "font-semibold" : ""}`}
                        >
                          {notification.title}
                        </p>
                        <p className="text-[10px] text-gray-600 mt-0.5 leading-tight">
                          {notification.message}
                        </p>
                        <p className="text-[9px] text-gray-400 mt-0.5">
                          {notification.time}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="flex-shrink-0">
                          <span className="inline-block w-2 h-2 bg-blue-600 rounded-full"></span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="px-4 py-3 border-t border-gray-200">
                <button
                  onClick={() => {
                    onClearAll?.();
                    setShowNotifications(false);
                  }}
                  className="w-full text-center text-sm text-gray-600 hover:text-gray-800 font-medium"
                >
                  Limpiar todas
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
