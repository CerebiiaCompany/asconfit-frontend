import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, User } from '../services/authService';
import { UserRole } from '../config/menuConfig';
import { LoadingState } from '../components/common/LoadingState';

interface AuthContextType {
    user: User | null;
    userRole: UserRole | null;
    loading: boolean;
    setUser: (user: User | null) => void;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [userRole, setUserRole] = useState<UserRole | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const refreshUser = async () => {
        try {
            if (authService.isAuthenticated()) {
                const currentUser = await authService.getCurrentUser();
                setUser(currentUser);
                setUserRole(currentUser.role.nombre.toLowerCase() as UserRole);
            } else {
                setUser(null);
                setUserRole(null);
            }
        } catch (error) {
            console.error('Error al obtener usuario:', error);
            authService.removeToken();
            setUser(null);
            setUserRole(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, userRole, loading, setUser, refreshUser }}>
            {loading ? <LoadingState message="Verificando sesión..." /> : children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};
