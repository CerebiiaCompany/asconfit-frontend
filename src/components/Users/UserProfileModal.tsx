import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, MapPin, Building, Calendar, FileText, Eye } from 'lucide-react';
import { userService, UserProfile } from '../../services/userService';
import { useToast } from '../../contexts/ToastContext';

interface UserProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: number;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
    isOpen,
    onClose,
    userId
}) => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(false);
    const { addToast } = useToast();

    useEffect(() => {
        if (isOpen && userId) {
            loadProfile();
        }
    }, [isOpen, userId]);

    const loadProfile = async () => {
        try {
            setLoading(true);
            const data = await userService.getUserProfile(userId);
            setProfile(data);
        } catch (error) {
            addToast('Error al cargar el perfil del usuario', 'error');
            onClose();
        } finally {
            setLoading(false);
        }
    };

    const handleViewCV = async () => {
        try {
            // Obtener la URL del CV y abrirlo en nueva pestaña
            const cvUrl = await userService.getUserCV(userId);
            window.open(cvUrl, '_blank');
        } catch (error) {
            addToast('Error al abrir el CV', 'error');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-800">Perfil de Usuario</h2>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                        </div>
                    ) : profile ? (
                        <div className="space-y-6">
                            {/* Profile Header */}
                            <div className="flex items-start gap-6">
                                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center overflow-hidden">
                                    {profile.profile_photo_url ? (
                                        <img
                                            src={profile.profile_photo_url}
                                            alt={profile.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <User className="w-10 h-10 text-orange-500" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-2xl font-bold text-gray-800">{profile.name}</h3>
                                    <p className="text-orange-600 font-semibold">{profile.role || 'Sin rol asignado'}</p>
                                    <p className="text-gray-500 text-sm flex items-center gap-1 mt-1">
                                        <Calendar className="w-4 h-4" />
                                        Miembro desde {profile.created_at}
                                    </p>
                                </div>
                            </div>

                            {/* Information Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Contact Information */}
                                <div className="space-y-4">
                                    <h4 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                                        Información de Contacto
                                    </h4>

                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                                            <Mail className="w-4 h-4 text-orange-500" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Email</p>
                                            <p className="text-gray-800">{profile.email}</p>
                                        </div>
                                    </div>

                                    {profile.phone && (
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                                                <Phone className="w-4 h-4 text-orange-500" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Teléfono</p>
                                                <p className="text-gray-800">{profile.phone}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Location Information */}
                                <div className="space-y-4">
                                    <h4 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                                        Ubicación
                                    </h4>

                                    {(profile.country || profile.city) && (
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                                                <MapPin className="w-4 h-4 text-orange-500" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Ubicación</p>
                                                <p className="text-gray-800">
                                                    {[profile.city, profile.country].filter(Boolean).join(', ') || 'No especificada'}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {profile.department && (
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                                                <Building className="w-4 h-4 text-orange-500" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Departamento</p>
                                                <p className="text-gray-800">{profile.department}</p>
                                            </div>
                                        </div>
                                    )}

                                    {profile.address && (
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mt-1">
                                                <MapPin className="w-4 h-4 text-orange-500" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Dirección</p>
                                                <p className="text-gray-800">{profile.address}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* CV Section */}
                            <div className="bg-gray-50 rounded-xl p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                            <FileText className="w-5 h-5 text-orange-500" />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-semibold text-gray-800">Hoja de Vida</h4>
                                            <p className="text-sm text-gray-500">
                                                {profile.has_cv ? 'CV disponible para visualización' : 'No hay CV cargado'}
                                            </p>
                                        </div>
                                    </div>

                                    {profile.has_cv && (
                                        <button
                                            onClick={handleViewCV}
                                            className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-colors"
                                        >
                                            <Eye className="w-4 h-4" />
                                            Ver CV
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12 text-gray-500">
                            No se pudo cargar la información del perfil
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 rounded-b-2xl">
                    <button
                        onClick={onClose}
                        className="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition-colors"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};