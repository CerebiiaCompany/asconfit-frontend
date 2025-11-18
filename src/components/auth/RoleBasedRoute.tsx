import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authService } from '../../services/authService';
import { canAccessRoute, UserRole } from '../../config/menuConfig';
import { AccessDenied } from '../../pages/AccessDenied';

interface RoleBasedRouteProps {
    children: React.ReactNode;
}

export const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({ children }) => {
    const location = useLocation();
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

    useEffect(() => {
        const checkAuthorization = async () => {
            try {
                // Verificar si el usuario está autenticado
                if (!authService.isAuthenticated()) {
                    setIsAuthorized(false);
                    return;
                }

                // Obtener el usuario actual
                const user = await authService.getCurrentUser();
                const role = user.role.nombre.toLowerCase() as UserRole;

                // Verificar si el usuario puede acceder a esta ruta
                const hasAccess = canAccessRoute(location.pathname, role);
                setIsAuthorized(hasAccess);
            } catch (error) {
                console.error('Error al verificar autorización:', error);
                setIsAuthorized(false);
            }
        };

        checkAuthorization();
    }, [location.pathname]);

    // Mostrar loading mientras se verifica
    if (isAuthorized === null) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }}>
                Cargando...
            </div>
        );
    }

    // Si no está autorizado, mostrar página de acceso denegado
    if (!isAuthorized) {
        return <AccessDenied />;
    }

    // Si está autorizado, mostrar el contenido
    return <>{children}</>;
};
