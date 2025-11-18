import React from 'react';
import { Auditoria } from '../../types/auditoria';

interface AuditoriaCardProps {
    auditoria: Auditoria;
    onViewComplete: (id: number) => void;
}

export const AuditoriaCard: React.FC<AuditoriaCardProps> = ({ auditoria, onViewComplete }) => {
    // Calcular porcentajes de progreso basados en subtareas
    const calculateProgress = () => {
        if (!auditoria.categorias || auditoria.categorias.length === 0) {
            return {
                na: 0,
                check: 0,
                pendiente: 0,
                enProceso: 0,
                total: 0
            };
        }

        // Obtener todas las subtareas
        const allSubtareas = auditoria.categorias.flatMap(cat => cat.subtareas || []);
        const totalSubtareas = allSubtareas.length;

        if (totalSubtareas === 0) {
            return {
                na: 0,
                check: 0,
                pendiente: 0,
                enProceso: 0,
                total: 0
            };
        }

        // Contar subtareas por estado
        const sinArchivo = allSubtareas.filter(s => !s.archivo_nombre).length;
        const aprobadas = allSubtareas.filter(s => s.estado_informacion === 'aprobado').length;
        const pendientes = allSubtareas.filter(s => s.estado_informacion === 'pendiente' || (!s.estado_informacion && s.archivo_nombre)).length;
        const enProceso = allSubtareas.filter(s => s.estado_informacion === 'recibido' || s.estado_informacion === 'revision').length;
        const conArchivo = allSubtareas.filter(s => s.archivo_nombre).length;

        return {
            na: (sinArchivo / totalSubtareas) * 100,
            check: (aprobadas / totalSubtareas) * 100,
            pendiente: (pendientes / totalSubtareas) * 100,
            enProceso: (enProceso / totalSubtareas) * 100,
            total: (conArchivo / totalSubtareas) * 100
        };
    };

    const progress = calculateProgress();

    const progressData = [
        { label: 'N/A', value: progress.na, color: 'bg-orange-500' },
        { label: 'Check', value: progress.check, color: 'bg-green-500' },
        { label: 'Pendiente', value: progress.pendiente, color: 'bg-red-500' },
        { label: 'En proceso', value: progress.enProceso, color: 'bg-green-400' },
        { label: 'Total', value: progress.total, color: 'bg-blue-500' }
    ];

    const getEstadoBadge = (estado: Auditoria['estado']) => {
        const badges = {
            pendiente: 'text-red-600',
            en_progreso: 'text-blue-600',
            completada: 'text-green-600'
        };
        const labels = {
            pendiente: 'Pendiente',
            en_progreso: 'En Proceso',
            completada: 'Completada'
        };
        return (
            <span className={`font-medium ${badges[estado]}`}>
                {labels[estado]}
            </span>
        );
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-6 mb-4">
            <div className="grid grid-cols-12 gap-4 items-center">
                {/* Radio button */}
                <div className="col-span-1 flex items-center justify-center">
                    <input
                        type="radio"
                        name="auditoria-select"
                        className="w-5 h-5 text-orange-500 focus:ring-orange-500"
                    />
                </div>

                {/* NIT */}
                <div className="col-span-2">
                    <div className="text-xs text-gray-500 mb-1">NIT</div>
                    <div className="text-sm font-medium text-gray-900">
                        {auditoria.nit || '-'}
                    </div>
                </div>

                {/* Razón Social */}
                <div className="col-span-2">
                    <div className="text-xs text-gray-500 mb-1">Razón social</div>
                    <div className="text-sm font-medium text-gray-900">
                        {auditoria.razon_social || auditoria.empresa || '-'}
                    </div>
                </div>

                {/* Visita de */}
                <div className="col-span-2">
                    <div className="text-xs text-gray-500 mb-1">Visita de:</div>
                    <div className="text-sm font-medium text-gray-900">
                        {auditoria.fecha_inicial ?
                            new Date(auditoria.fecha_inicial).toLocaleDateString('es-ES', {
                                day: '2-digit',
                                month: 'short'
                            }).replace('.', '')
                            : 'Planeación'}
                    </div>
                </div>

                {/* Corte */}
                <div className="col-span-2">
                    <div className="text-xs text-gray-500 mb-1">Corte</div>
                    <div className="text-sm">
                        {getEstadoBadge(auditoria.estado)}
                    </div>
                </div>

                {/* Proceso - Progress indicators */}
                <div className="col-span-3">
                    <div className="text-xs text-gray-500 mb-2">Proceso</div>
                    <div className="flex items-center gap-3">
                        {progressData.map((item, index) => (
                            <div key={index} className="flex flex-col items-center">
                                <div className="flex items-center gap-1 mb-1">
                                    <span className="text-xs text-gray-600">{item.label}</span>
                                    <div className={`w-2 h-2 rounded-full ${item.color}`}></div>
                                </div>
                                <span className="text-xs font-medium text-gray-900">
                                    {item.value.toFixed(1)}%
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Button */}
            <div className="mt-4 flex justify-end">
                <button
                    onClick={() => onViewComplete(auditoria.id)}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                >
                    Ver auditoría completa
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    );
};
