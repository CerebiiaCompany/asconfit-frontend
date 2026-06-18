import React from 'react';
import { User } from '../../services/authService';
import { WelcomeCard } from './WelcomeCard';
import { ActivitySchedule } from './ActivitySchedule';
import { AnnouncementUploader } from './AnnouncementUploader';
import { OurServices } from './OurServices';
import { FounderBanner } from './VideoPlayerCard';

interface HomeViewProps {
    user: User | null;
}

export const HomeView: React.FC<HomeViewProps> = ({ user }) => {
    return (
        <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto bg-[#F9FAFB] min-h-screen">
            <WelcomeCard userName={user?.name} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mt-4">
                {/* Row 1 */}
                <ActivitySchedule />
                {/* Row 1 
                <AnnouncementUploader />

                <OurServices />
                <FounderBanner /> */}
            </div>
        </div>
    );
};
