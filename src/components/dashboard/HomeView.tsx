import React from 'react';
import { User } from '../../services/authService';
import { WelcomeCard } from './WelcomeCard';
import { ActivitySchedule } from './ActivitySchedule';
import { OverdueStats } from './OverdueStats';
import { FindingsStats } from './FindingsStats';
import { CumplimientoStats } from './CumplimientoStats';
import { DashboardFilters } from './DashboardFilters';
import { useDashboardFilters } from '../../hooks/useDashboardFilters';

interface HomeViewProps {
    user: User | null;
}

export const HomeView: React.FC<HomeViewProps> = ({ user }) => {
    const { filters, empresas, delegados, loadingOptions, activeCount, updateFilter, clearFilters } =
        useDashboardFilters();

    return (
        <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto bg-[#F9FAFB] min-h-screen">
            <WelcomeCard userName={user?.name} />

            {/* Filtros globales */}
            <div className="mt-4">
                <DashboardFilters
                    filters={filters}
                    empresas={empresas}
                    delegados={delegados}
                    loadingOptions={loadingOptions}
                    activeCount={activeCount}
                    onUpdate={updateFilter}
                    onClear={clearFilters}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                {/* Row 1 */}
                <ActivitySchedule />
                <OverdueStats filters={filters} />

                {/* Row 2: Cumplimiento ocupa las 2 columnas */}
                <CumplimientoStats filters={filters} />

                {/* Row 3 */}
                <FindingsStats filters={filters} />
            </div>
        </div>
    );
};
