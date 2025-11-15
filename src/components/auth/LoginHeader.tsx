import React from 'react';
import { COLORS } from '../../constants';

/**
 * Componente de encabezado del login (presentacional)
 */
export const LoginHeader: React.FC = () => {
    return (
        <>
            <div className="text-center mb-6">
                <div className="inline-block rounded-xl p-4" style={{ backgroundColor: COLORS.primary }}>
                    <img
                        src="/Asconfit.png"
                        alt="Asconfit Logo"
                        className="h-12 w-auto"
                    />
                </div>
            </div>

            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 text-center">
                    Iniciar Sesión
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Accede a tu cuenta de Asconfit
                </p>
            </div>
        </>
    );
};
