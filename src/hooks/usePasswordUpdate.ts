import { useState } from 'react';
import { authService } from '../services/authService';
import { Message } from '../types/userSettings.types';
import { useToast } from '../contexts/ToastContext';

export const usePasswordUpdate = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState<Message | null>(null);
    const { addToast } = useToast();

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordLoading(true);
        setPasswordMessage(null);

        if (newPassword !== confirmPassword) {
            const errorText = 'Las contraseñas no coinciden';
            setPasswordMessage({ type: 'error', text: errorText });
            addToast(errorText, 'error');
            setPasswordLoading(false);
            return;
        }

        if (newPassword.length < 8) {
            const errorText = 'La contraseña debe tener al menos 8 caracteres';
            setPasswordMessage({ type: 'error', text: errorText });
            addToast(errorText, 'error');
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
            addToast(response.message, 'success');
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
            addToast(errorMessage, 'error');
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
