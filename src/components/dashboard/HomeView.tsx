import React from 'react';
import { User } from '../../services/authService';
import { WelcomeCard } from './WelcomeCard';
import { UserInfoCard } from './UserInfoCard';
import { StatsGrid } from './StatsGrid';

interface HomeViewProps {
    user: User | null;
}

export const HomeView: React.FC<HomeViewProps> = ({ user }) => {
    return (
        <main className="ml-32 pt-20 py-6 px-4 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
                <WelcomeCard userName={user?.name} />
                <UserInfoCard user={user} />
                <StatsGrid />
            </div>
        </main>
    );
};
