import React from 'react';

interface WelcomeCardProps {
    userName?: string;
}

export const WelcomeCard: React.FC<WelcomeCardProps> = ({ userName }) => {
    return (
        <div className="bg-white overflow-hidden shadow-xl rounded-2xl mb-6 px-6 py-8">
            <h2 className="text-3xl font-bold text-gray-900">
                Hola, {userName}
            </h2>
            <p className="mt-2 text-gray-600">
                Bienvenido/a
            </p>
        </div>
    );
};
