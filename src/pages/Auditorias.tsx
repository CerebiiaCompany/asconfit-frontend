import React, { useState } from 'react';
import { useAuditorias } from '../hooks/useAuditorias';
import { AuditoriaStatsCard } from '../components/auditorias/AuditoriaStatsCard';
import { AuditoriaSearchBar } from '../components/auditorias/AuditoriaSearchBar';
import { AuditoriaEmptyState } from '../components/auditorias/AuditoriaEmptyState';

export const Auditorias: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const { stats } = useAuditorias();

    const handleNewAuditoria = () => {
        console.log('Nueva auditoría');
    };

    const statsConfig = [
        {
            title: 'Total',
            value: stats.total,
            icon: (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
            borderColor: 'border-blue-600',
            bgColor: 'bg-blue-100',
            iconColor: 'text-blue-600'
        },
        {
            title: 'Completadas',
            value: stats.completadas,
            icon: (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            borderColor: 'border-green-600',
            bgColor: 'bg-green-100',
            iconColor: 'text-green-600'
        },
        {
            title: 'En Progreso',
            value: stats.en_progreso,
            icon: (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            borderColor: 'border-yellow-600',
            bgColor: 'bg-yellow-100',
            iconColor: 'text-yellow-600'
        },
        {
            title: 'Pendientes',
            value: stats.pendientes,
            icon: (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            ),
            borderColor: 'border-red-600',
            bgColor: 'bg-red-100',
            iconColor: 'text-red-600'
        }
    ];

    return (
        <main className="ml-32 pt-20 py-6 px-4 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
                {/* Header Card */}
                <div className="bg-white overflow-hidden shadow-xl rounded-2xl mb-6">
                    <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-8">
                        <h2 className="text-3xl font-bold text-white">
                            Auditorías 📋
                        </h2>
                        <p className="mt-2 text-blue-100">
                            Gestiona y revisa las auditorías del sistema
                        </p>
                    </div>
                </div>

                {/* Search and Actions */}
                <AuditoriaSearchBar
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    onNewAuditoria={handleNewAuditoria}
                />

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    {statsConfig.map((stat, index) => (
                        <AuditoriaStatsCard key={index} {...stat} />
                    ))}
                </div>

                {/* Auditorías List */}
                <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">Lista de Auditorías</h3>
                    </div>
                    <div className="p-6">
                        <AuditoriaEmptyState onNewAuditoria={handleNewAuditoria} />
                    </div>
                </div>
            </div>
        </main>
    );
};
