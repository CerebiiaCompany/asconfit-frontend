import { useState } from 'react';
import { DashboardView } from '../types/dashboard';

export const useDashboardNavigation = (initialView: DashboardView = 'inicio') => {
    const [currentView, setCurrentView] = useState<DashboardView>(initialView);

    const navigateTo = (view: DashboardView) => {
        setCurrentView(view);
    };

    return { currentView, navigateTo };
};
