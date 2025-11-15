import { useState } from 'react';

export interface Notification {
    id: string;
    title: string;
    message: string;
    time: string;
    read: boolean;
    type?: 'info' | 'warning' | 'success' | 'error';
}

// Notificaciones de prueba (en producción vendrían de una API)
const initialNotifications: Notification[] = [
    {
        id: '1',
        title: 'Nueva auditoría asignada',
        message: 'Se te ha asignado la auditoría de Empresa ABC para revisión',
        time: 'Hace 5 minutos',
        read: false,
        type: 'info'
    },
    {
        id: '2',
        title: 'Auditoría completada',
        message: 'La auditoría de Empresa XYZ ha sido completada exitosamente',
        time: 'Hace 1 hora',
        read: false,
        type: 'success'
    },
    {
        id: '3',
        title: 'Documento pendiente',
        message: 'Faltan documentos por cargar en la auditoría de Empresa DEF',
        time: 'Hace 2 horas',
        read: true,
        type: 'warning'
    },
    {
        id: '4',
        title: 'Error en validación',
        message: 'Se encontraron errores en la validación de documentos',
        time: 'Hace 3 horas',
        read: true,
        type: 'error'
    },
    {
        id: '5',
        title: 'Recordatorio',
        message: 'Tienes 3 auditorías pendientes de revisión esta semana',
        time: 'Hace 1 día',
        read: true,
        type: 'info'
    }
];

export const useNotifications = () => {
    const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

    const handleMarkAsRead = (id: string) => {
        setNotifications(prev =>
            prev.map(notif =>
                notif.id === id ? { ...notif, read: true } : notif
            )
        );
    };

    const handleMarkAllAsRead = () => {
        setNotifications(prev =>
            prev.map(notif => ({ ...notif, read: true }))
        );
    };

    const handleClearAll = () => {
        setNotifications([]);
    };

    return {
        notifications,
        handleMarkAsRead,
        handleMarkAllAsRead,
        handleClearAll
    };
};
