import { useState } from 'react';
import { authService, User } from '../services/authService';
import { Message } from '../types/userSettings.types';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';

export const useUserProfile = (initialUser: User) => {
    const { setUser: setGlobalUser } = useAuth();
    const [user, setUser] = useState<User>(initialUser);
    const [name, setName] = useState(initialUser.name);
    const [email, setEmail] = useState(initialUser.email);
    const [phone, setPhone] = useState(initialUser.phone || '');
    const [documentType, setDocumentType] = useState(initialUser.document_type || '');
    const [documentNumber, setDocumentNumber] = useState(initialUser.document_number || '');
    const [country, setCountry] = useState(initialUser.country || '');
    const [city, setCity] = useState(initialUser.city || '');
    const [department, setDepartment] = useState(initialUser.department || '');

    const [profileLoading, setProfileLoading] = useState(false);
    const [profileMessage, setProfileMessage] = useState<Message | null>(null);
    const { addToast } = useToast();

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setProfileLoading(true);
        setProfileMessage(null);

        try {
            const response = await authService.updateProfile({
                name,
                email,
                phone,
                document_type: documentType,
                document_number: documentNumber,
                country,
                city,
                department
            });
            setProfileMessage({ type: 'success', text: response.message });
            setUser(response.user);
            setGlobalUser(response.user); // Sincronizar con el estado global
            addToast(response.message, 'success');
            return true;
        } catch (error: any) {
            const errorText = error.response?.data?.message || error.message || 'Error al actualizar el perfil';
            setProfileMessage({
                type: 'error',
                text: errorText
            });
            addToast(errorText, 'error');
            return false;
        } finally {
            setProfileLoading(false);
        }
    };

    const handlePhotoUpload = async (file: File) => {
        setProfileLoading(true);
        try {
            const response = await authService.updatePhoto(file);
            setUser(response.user);
            setGlobalUser(response.user);
            addToast(response.message, 'success');
        } catch (error: any) {
            const errorText = error.response?.data?.message || error.message || 'Error al subir la foto';
            addToast(errorText, 'error');
        } finally {
            setProfileLoading(false);
        }
    };

    const handleCVUpload = async (file: File) => {
        setProfileLoading(true);
        try {
            const response = await authService.uploadCV(file);
            setUser(response.user);
            setGlobalUser(response.user);
            addToast(response.message, 'success');
        } catch (error: any) {
            const errorText = error.response?.data?.message || error.message || 'Error al subir la hoja de vida';
            addToast(errorText, 'error');
        } finally {
            setProfileLoading(false);
        }
    };

    const handleTarjetaProfesionalUpload = async (file: File) => {
        setProfileLoading(true);
        try {
            const response = await authService.uploadTarjetaProfesional(file);
            setUser(response.user);
            setGlobalUser(response.user);
            addToast(response.message, 'success');
        } catch (error: any) {
            const errorText = error.response?.data?.message || error.message || 'Error al subir la tarjeta profesional';
            addToast(errorText, 'error');
        } finally {
            setProfileLoading(false);
        }
    };

    return {
        user,
        name, setName,
        email, setEmail,
        phone, setPhone,
        documentType, setDocumentType,
        documentNumber, setDocumentNumber,
        country, setCountry,
        city, setCity,
        department, setDepartment,
        profileLoading,
        profileMessage,
        handleProfileUpdate,
        handlePhotoUpload,
        handleCVUpload,
        handleTarjetaProfesionalUpload
    };
};
