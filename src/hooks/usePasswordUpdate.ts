import { useState } from 'react';
import { authService } from '../services/authService';
import { Message } from '../types/userSettings.types';

export const usePasswordUpdate = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState<Message | null>(null);

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordLoading(true);
        setPasswordMessage(null);

        if (newPassword !== confirmPassword) {
            setPasswordMessage({ type: 'error', text: 'Las contraseñas no coinciden' });
            setPasswordLoading(false);
            return;
        }

        if (newPassword.length < 8) {
            setPasswordMessage({ type: 'error', text: 'La contraseña debe tener al menos 8 caracteres' });
            setPasswordLoading(false);
            return;
        }

        try {
            const response = await authService.updatePassword({
                current_password: currentPassword,
                new_password: newPassword,
                new_password_confirmation: confirmPassword
            });

            setPasswordMessage({ type: 'success', text: response.message });
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            const errorMessage = error.response?.data?.message
                || error.response?.data?.errors?.current_password?.[0]
                || error.response?.data?.errors?.new_password?.[0]
                || error.message
                || 'Error al actualizar la contraseña';

            setPasswordMessage({
                type: 'error',
                text: errorMessage
            });
        } finally {
            setPasswordLoading(false);
        }
    };

    return {
        currentPassword,
        setCurrentPassword,
        newPassword,
        setNewPassword,
        confirmPassword,
        setConfirmPassword,
        passwordLoading,
        passwordMessage,
        handlePasswordUpdate
    };
};
