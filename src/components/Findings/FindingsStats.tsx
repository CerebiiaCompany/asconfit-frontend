import React from "react";

interface FindingsStatsProps {
    abiertos: number;
    enProceso: number;
    cerrados: number;
}

export function FindingsStats({ abiertos, enProceso, cerrados }: FindingsStatsProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
            <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                    </svg>
                </div>
                <div>
                    <p className="text-2xl font-bold text-gray-800">{abiertos}</p>
                    <p className="text-xs text-gray-500">Abiertos</p>
                </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <div>
                    <p className="text-2xl font-bold text-gray-800">{enProceso}</p>
                    <p className="text-xs text-gray-500">En proceso</p>
                </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <div>
                    <p className="text-2xl font-bold text-gray-800">{cerrados}</p>
                    <p className="text-xs text-gray-500">Cerrados</p>
                </div>
            </div>
        </div>
    );
}
