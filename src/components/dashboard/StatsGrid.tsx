import React from 'react';

export const StatsGrid: React.FC = () => {
    return (
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white overflow-hidden shadow-lg rounded-xl p-6 border-l-4 border-gray-600">
                <div className="flex items-center">
                    <div className="flex-shrink-0 bg-gray-100 rounded-lg p-3">
                        <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Estado</p>
                        <p className="text-lg font-semibold text-gray-900">Activo</p>
                    </div>
                </div>
            </div>

            <div className="bg-white overflow-hidden shadow-lg rounded-xl p-6 border-l-4 border-green-600">
                <div className="flex items-center">
                    <div className="flex-shrink-0 bg-green-100 rounded-lg p-3">
                        <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Seguridad</p>
                        <p className="text-lg font-semibold text-gray-900">Protegido</p>
                    </div>
                </div>
            </div>

            <div className="bg-white overflow-hidden shadow-lg rounded-xl p-6 border-l-4 border-blue-600">
                <div className="flex items-center">
                    <div className="flex-shrink-0 bg-blue-100 rounded-lg p-3">
                        <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">API</p>
                        <p className="text-lg font-semibold text-gray-900">Conectado</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
