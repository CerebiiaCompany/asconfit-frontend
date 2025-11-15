import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RegisterForm } from './RegisterForm';

export const Register: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full">
                {/* Card */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="px-8 py-10">
                        {/* Logo */}
                        <div className="text-center mb-6">
                            <div className="inline-block rounded-xl p-4" style={{ backgroundColor: '#FF9411' }}>
                                <img
                                    src="/Asconfit.png"
                                    alt="Asconfit Logo"
                                    className="h-12 w-auto"
                                />
                            </div>
                        </div>

                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 text-center">
                                Crear Cuenta
                            </h2>
                            <p className="mt-2 text-center text-sm text-gray-600">
                                Únete a Asconfit hoy
                            </p>
                        </div>

                        <RegisterForm onRegisterSuccess={() => navigate('/dashboard')} />
                    </div>

                    <div className="px-8 py-4 bg-gray-50 border-t border-gray-200">
                        <p className="text-center text-sm text-gray-600">
                            ¿Ya tienes cuenta?{' '}
                            <button
                                type="button"
                                onClick={() => navigate('/login')}
                                className="font-medium hover:underline transition duration-150"
                                style={{ color: '#FF9411' }}
                            >
                                Inicia sesión aquí
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
