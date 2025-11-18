import React from 'react';
import { useLocation } from 'react-router-dom';
import { canAccessRoute } from '../../config/menuConfig';
import { AccessDenied } from '../../pages/AccessDenied';
import { useAuth } from '../../contexts/AuthContext';
import { LoadingSpinner } from '../dashboard/LoadingSpinner';

interface RoleBasedRouteProps {
    children: React.ReactNode;
}

export const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({ children }) => {
    const location = useLocation();
    const { userRole, loading } = useAuth();

    // Mostrar loading mientras se verifica
    if (loading) {
        return <LoadingSpinner />;
    }

    // Si no hay rol, mostrar acceso denegado
    if (!userRole) {
        return <AccessDenied />;
    }

    // Verificar si el usuario puede acceder a esta ruta
    const hasAccess = canAccessRoute(location.pathname, userRole);

    // Si no está autorizado, mostrar página de acceso denegado
    if (!hasAccess) {
        return <AccessDenied />;
    }

    // Si está autorizado, mostrar el contenido
    return <>{children}</>;
};
