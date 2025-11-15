import { useEffect, useState, useRef } from 'react';
import { authService, User } from '../services/authService';

export const useUser = (onLogout: () => void) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const onLogoutRef = useRef(onLogout);

    // Actualizar la referencia cuando cambie onLogout
    useEffect(() => {
        onLogoutRef.current = onLogout;
    }, [onLogout]);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const userData = await authService.getCurrentUser();
                setUser(userData);
            } catch (error) {
                console.error('Error loading user:', error);
                onLogoutRef.current();
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []); // Sin dependencias - solo se ejecuta una vez al montar

    return { user, loading };
};
