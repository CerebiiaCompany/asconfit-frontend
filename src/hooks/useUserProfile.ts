import { useState } from 'react';
import { authService, User } from '../services/authService';
import { Message } from '../types/userSettings.types';

export const useUserProfile = (initialUser: User) => {
    const [user, setUser] = useState<User>(initialUser);
    const [name, setName] = useState(initialUser.name);
    const [email, setEmail] = useState(initialUser.email);
    const [profileLoading, setProfileLoading] = useState(false);
    const [profileMessage, setProfileMessage] = useState<Message | null>(null);

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setProfileLoading(true);
        setProfileMessage(null);

        try {
            const response = await authService.updateProfile({ name, email });
            setProfileMessage({ type: 'success', text: response.message });
            setUser(response.user);
        } catch (error: any) {
            setProfileMessage({
                type: 'error',
                text: error.response?.data?.message || error.message || 'Error al actualizar el perfil'
            });
        } finally {
            setProfileLoading(false);
        }
    };

    return {
        user,
        name,
        setName,
        email,
        setEmail,
        profileLoading,
        profileMessage,
        handleProfileUpdate
    };
};
