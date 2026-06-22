import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, FileText, User } from 'lucide-react';
import { userService } from '../services/userService';
import { useToast } from '../contexts/ToastContext';

const UserCV: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const navigate = useNavigate();
    const [cvUrl, setCvUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { addToast } = useToast();

    useEffect(() => {
        if (userId) {
            loadCV();
        }
    }, [userId]);

    const loadCV = async () => {
        try {
            setLoading(true);
            setError(null);
            const url = await userService.getUserCV(Number(userId));
            setCvUrl(url);
        } catch (error: any) {
            console.error('Error loading CV:', error);
            if (error.response?.status === 404) {
                setError('El usuario no tiene CV cargado');
            } else {
                setError('Error al cargar el CV');
            }
            addToast('Error al cargar el CV', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        if (cvUrl) {
            const link = document.createElement('a');
            link.href = cvUrl;
            link.download = `CV_Usuario_${userId}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleBack}
                                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                Volver
                            </button>
                            <h1 className="text-xl font-semibold text-gray-800">
                                Hoja de Vida - Usuario {userId}
                            </h1>
                        </div>

                        {cvUrl && (
                            <button
                                onClick={handleDownload}
                                className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-colors"
                            >
                                <Download className="w-4 h-4" />
                                Descargar CV
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mb-4"></div>
                        <p className="text-gray-600">Cargando CV...</p>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                            <FileText className="w-8 h-8 text-gray-400" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">No se pudo cargar el CV</h2>
                        <p className="text-gray-600 mb-4">{error}</p>
                        <button
                            onClick={handleBack}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Regresar
                        </button>
                    </div>
                ) : cvUrl ? (
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <div className="h-[800px]">
                            <iframe
                                src={cvUrl}
                                className="w-full h-full"
                                title="CV del Usuario"
                                frameBorder="0"
                            />
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                            <User className="w-8 h-8 text-gray-400" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">Sin CV disponible</h2>
                        <p className="text-gray-600">Este usuario no tiene CV cargado</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserCV;