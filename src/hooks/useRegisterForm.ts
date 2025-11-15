import { useState } from 'react';
import { authService } from '../services/authService';
import { RegisterFormData } from '../types/auth.types';

export const useRegisterForm = (onSuccess: () => void) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== passwordConfirmation) {
            setError('Las contraseñas no coinciden');
            return;
        }

        setLoading(true);

        try {
            const data: RegisterFormData = {
                name,
                email,
                password,
                password_confirmation: passwordConfirmation,
            };
            await authService.register(data);
            onSuccess();
        } catch (err: any) {
            setError(err.message || 'Error al registrarse');
        } finally {
            setLoading(false);
        }
    };

    return {
        name,
        setName,
        email,
        setEmail,
        password,
        setPassword,
        passwordConfirmation,
        setPasswordConfirmation,
        error,
        loading,
        handleSubmit,
    };
};
