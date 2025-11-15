import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoginForm } from '../../hooks';
import { LoginHeader } from './LoginHeader';
import { LoginForm } from './LoginForm';
import { LoginFooter } from './LoginFooter';

/**
 * Componente principal de Login (contenedor)
 * Maneja la lógica de negocio y coordina los componentes presentacionales
 */
export const Login: React.FC = () => {
    const navigate = useNavigate();

    const {
        email,
        password,
        error,
        loading,
        setEmail,
        setPassword,
        handleSubmit,
    } = useLoginForm({ onSuccess: () => navigate('/dashboard') });

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="px-8 py-10">
                        <LoginHeader />
                        <LoginForm
                            email={email}
                            password={password}
                            error={error}
                            loading={loading}
                            onEmailChange={setEmail}
                            onPasswordChange={setPassword}
                            onSubmit={handleSubmit}
                        />
                    </div>
                    <LoginFooter onSwitchToRegister={() => navigate('/register')} />
                </div>
            </div>
        </div>
    );
};
