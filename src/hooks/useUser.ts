import { useEffect, useState } from 'react';
import { authService, User } from '../services/authService';

export const useUser = (onLogout: () => void) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const userData = await authService.getCurrentUser();
                setUser(userData);
            } catch (error) {
                console.error('Error loading user:', error);
                onLogout();
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, [onLogout]);

    return { user, loading };
};
