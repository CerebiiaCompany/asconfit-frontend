import { useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';

export const useUser = (onLogout: () => void) => {
    const { user, loading } = useAuth();
    const onLogoutRef = useRef(onLogout);

    // Actualizar la referencia cuando cambie onLogout
    useEffect(() => {
        onLogoutRef.current = onLogout;
    }, [onLogout]);

    // Si hay un error de autenticación, ejecutar logout
    useEffect(() => {
        if (!loading && !user) {
            onLogoutRef.current();
        }
    }, [loading, user]);

    return { user, loading };
};
