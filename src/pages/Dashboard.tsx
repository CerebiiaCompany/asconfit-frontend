import React from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { useUser } from '../hooks/useUser';
import { LoadingSpinner } from '../components/dashboard/LoadingSpinner';
import { HomeView } from '../components/dashboard/HomeView';

export const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const { user, loading } = useUser(() => navigate('/login'));

    // Notificaciones de prueba
    const [notifications, setNotifications] = React.useState([
        {
            id: '1',
            title: 'Nueva auditoría asignada',
            message: 'Se te ha asignado la auditoría de Empresa ABC para revisión',
            time: 'Hace 5 minutos',
            read: false,
            type: 'info' as const
        },
        {
            id: '2',
            title: 'Auditoría completada',
            message: 'La auditoría de Empresa XYZ ha sido completada exitosamente',
            time: 'Hace 1 hora',
            read: false,
            type: 'success' as const
        },
        {
            id: '3',
            title: 'Documento pendiente',
            message: 'Faltan documentos por cargar en la auditoría de Empresa DEF',
            time: 'Hace 2 horas',
            read: true,
            type: 'warning' as const
        },
        {
            id: '4',
            title: 'Error en validación',
            message: 'Se encontraron errores en la validación de documentos',
            time: 'Hace 3 horas',
            read: true,
            type: 'error' as const
        },
        {
            id: '5',
            title: 'Recordatorio',
            message: 'Tienes 3 auditorías pendientes de revisión esta semana',
            time: 'Hace 1 día',
            read: true,
            type: 'info' as const
        }
    ]);

    const handleLogout = async () => {
        try {
            await authService.logout();
            navigate('/login');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

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

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <Header
                userName={user?.name}
                onLogout={handleLogout}
                onNavigateToSettings={() => navigate('/perfil')}
                notifications={notifications}
                onMarkNotificationAsRead={handleMarkAsRead}
                onMarkAllNotificationsAsRead={handleMarkAllAsRead}
                onClearAllNotifications={handleClearAll}
            />
            <Sidebar onLogout={handleLogout} />
            {loading ? <LoadingSpinner /> : <HomeView user={user} />}
        </div>
    );
};
