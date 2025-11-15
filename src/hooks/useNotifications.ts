import { useState, useEffect } from 'react';
import { notificacionService, Notificacion } from '../services/notificacionService';

export interface Notification {
    id: string;
    title: string;
    message: string;
    time: string;
    read: boolean;
    type?: 'info' | 'warning' | 'success' | 'error';
}

const getNotificationType = (tipo: string): 'info' | 'warning' | 'success' | 'error' => {
    switch (tipo) {
        case 'auditoria_creada':
        case 'tarea_asignada':
            return 'info';
        case 'archivo_subido':
            return 'success';
        case 'auditoria_completada':
            return 'success';
        case 'documento_pendiente':
            return 'warning';
        case 'error':
            return 'error';
        default:
            return 'info';
    }
};

const getTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Justo ahora';
    if (diffMins < 60) return `Hace ${diffMins} minuto${diffMins > 1 ? 's' : ''}`;
    if (diffHours < 24) return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
    if (diffDays < 7) return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
    return date.toLocaleDateString();
};

const convertToNotification = (notif: Notificacion): Notification => ({
    id: notif.id.toString(),
    title: notif.titulo,
    message: notif.mensaje,
    time: getTimeAgo(notif.created_at),
    read: notif.leida,
    type: getNotificationType(notif.tipo)
});

export const useNotifications = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    const loadNotifications = async () => {
        try {
            const data = await notificacionService.getAll();
            setNotifications(data.map(convertToNotification));
        } catch (error) {
            console.error('Error al cargar notificaciones:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadNotifications();

        // Recargar notificaciones cada 30 segundos
        const interval = setInterval(loadNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleMarkAsRead = async (id: string) => {
        try {
            await notificacionService.markAsRead(parseInt(id));
            setNotifications(prev =>
                prev.map(notif =>
                    notif.id === id ? { ...notif, read: true } : notif
                )
            );
        } catch (error) {
            console.error('Error al marcar como leída:', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notificacionService.markAllAsRead();
            setNotifications(prev =>
                prev.map(notif => ({ ...notif, read: true }))
            );
        } catch (error) {
            console.error('Error al marcar todas como leídas:', error);
        }
    };

    const handleClearAll = async () => {
        try {
            await notificacionService.deleteAll();
            setNotifications([]);
        } catch (error) {
            console.error('Error al limpiar notificaciones:', error);
        }
    };

    return {
        notifications,
        loading,
        handleMarkAsRead,
        handleMarkAllAsRead,
        handleClearAll,
        refreshNotifications: loadNotifications
    };
};
