import React from 'react';
import { COLORS } from '../../constants';

interface LoginFooterProps {
    onSwitchToRegister: () => void;
}

/**
 * Componente de pie de página del login (presentacional)
 */
export const LoginFooter: React.FC<LoginFooterProps> = ({ onSwitchToRegister }) => {
    return (
        <div className="px-8 py-4 bg-gray-50 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600">
                ¿No tienes cuenta?{' '}
                <button
                    type="button"
                    onClick={onSwitchToRegister}
                    className="font-medium hover:underline transition duration-150"
                    style={{ color: COLORS.primary }}
                >
                    Regístrate aquí
                </button>
            </p>
        </div>
    );
};
