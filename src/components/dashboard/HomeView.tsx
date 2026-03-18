import React from 'react';
import { User } from '../../services/authService';
import { WelcomeCard } from './WelcomeCard';

interface HomeViewProps {
    user: User | null;
}

export const HomeView: React.FC<HomeViewProps> = ({ user }) => {
    return (
        <div className="py-4 px-4 sm:px-0">
            <WelcomeCard userName={user?.name} />
        </div>
    );
};
