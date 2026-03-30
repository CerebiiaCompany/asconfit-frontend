import React from 'react';

interface WelcomeCardProps {
    userName?: string;
}

export const WelcomeCard: React.FC<WelcomeCardProps> = ({ userName }) => {
    return (
        <div className="mb-8 ml-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
                Hola, {userName}
            </h2>
            <p className="mt-1 text-sm sm:text-base text-gray-500 font-medium">
                Bienvenido/a
            </p>
        </div>
    );
};
