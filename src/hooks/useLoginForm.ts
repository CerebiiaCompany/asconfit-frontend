import { useState } from 'react';
import { authService } from '../services/authService';
import { useAuth } from '../contexts/AuthContext';
import type { LoginCredentials } from '../types';

interface UseLoginFormProps {
    onSuccess: () => void;
}

interface UseLoginFormReturn {
    email: string;
    password: string;
    error: string;
    loading: boolean;
    setEmail: (email: string) => void;
    setPassword: (password: string) => void;
    handleSubmit: (e: React.FormEvent) => Promise<void>;
    clearError: () => void;
}

/**
 * Hook personalizado para manejar la lógica del formulario de login
 */
export const useLoginForm = ({ onSuccess }: UseLoginFormProps): UseLoginFormReturn => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { refreshUser } = useAuth();

    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const credentials: LoginCredentials = { email, password };
            await authService.login(credentials);
            // Actualizar el contexto con el usuario autenticado
            await refreshUser();
            onSuccess();
        } catch (err: any) {
            setError(err.message || 'Error al iniciar sesión');
        } finally {
            setLoading(false);
        }
    };

    const clearError = (): void => {
        setError('');
    };

    return {
        email,
        password,
        error,
        loading,
        setEmail,
        setPassword,
        handleSubmit,
        clearError,
    };
};
