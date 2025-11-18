import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldX, Home } from 'lucide-react';

export const AccessDenied: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
                <div className="mb-6 flex justify-center">
                    <div className="bg-red-100 rounded-full p-4">
                        <ShieldX className="w-16 h-16 text-red-600" />
                    </div>
                </div>

                <h1 className="text-6xl font-bold text-red-600 mb-4">
                    403
                </h1>

                <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                    Acceso Denegado
                </h2>

                <p className="text-gray-600 mb-8 leading-relaxed">
                    Lo sentimos, no tienes los permisos necesarios para acceder a esta página.
                    Si crees que esto es un error, contacta con el administrador del sistema.
                </p>

                <button
                    onClick={() => navigate('/dashboard')}
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                >
                    <Home className="w-5 h-5" />
                    Volver al Inicio
                </button>
            </div>
        </div>
    );
};
