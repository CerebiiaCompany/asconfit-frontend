import { useState, useEffect } from 'react';
import { authService, User } from '../services/authService';
import { Message } from '../types/userSettings.types';

export const useUserProfile = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [profileLoading, setProfileLoading] = useState(false);
    const [profileMessage, setProfileMessage] = useState<Message | null>(null);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const userData = await authService.getCurrentUser();
                setUser(userData);
                setName(userData.name);
                setEmail(userData.email);
            } catch (error) {
                console.error('Error loading user:', error);
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

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
        loading,
        name,
        setName,
        email,
        setEmail,
        profileLoading,
        profileMessage,
        handleProfileUpdate
    };
};
