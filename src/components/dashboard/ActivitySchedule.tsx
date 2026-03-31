import React from 'react';
import { useAuditorias } from '../../hooks/useAuditorias';
import { Calendar, CalendarEvent } from '../common/Calendar';

export const ActivitySchedule: React.FC = () => {
    const { auditorias } = useAuditorias();

    // Paleta de colores para las auditorías
    const colors = [
        'bg-orange-500', 
        'bg-blue-600', 
        'bg-green-500', 
        'bg-purple-600', 
        'bg-emerald-600'
    ];

    // Obtener las 5 auditorías más cercanas (desde hoy en adelante)
    const upcomingAuditorias = [...auditorias]
        .filter(a => a.fecha_inicial)
        .sort((a, b) => new Date(a.fecha_inicial!).getTime() - new Date(b.fecha_inicial!).getTime())
        .filter(a => {
            const auditDate = new Date(a.fecha_inicial!);
            auditDate.setHours(0, 0, 0, 0);
            const today = new Date();
            today.setHours(0,0,0,0);
            return auditDate.getTime() >= today.getTime();
        })
        .slice(0, 5)
        .map((audit, index) => ({
            ...audit,
            colorClass: colors[index % colors.length]
        }));

    // Convertir auditorías a formato de eventos del calendario
    const calendarEvents: CalendarEvent[] = upcomingAuditorias.map(audit => ({
        date: audit.fecha_inicial!,
        title: audit.empresa?.razon_social || audit.razon_social || 'Auditoría',
        color: audit.colorClass
    }));

    return (
        <div className="bg-white rounded-2xl shadow-xl p-6 h-full border border-gray-100 flex flex-col">
            <h3 className="text-xl font-semibold text-gray-800 text-center mb-6">Cronograma Actividades</h3>
            
            <div className="flex flex-col lg:flex-row gap-6 flex-grow">
                {/* Calendar Section */}
                <div className="flex-1 flex justify-center items-start">
                    <Calendar events={calendarEvents} />
                </div>

                {/* Activities List */}
                <div className="flex-1 flex flex-col gap-3 justify-start overflow-y-auto max-h-[300px] lg:max-h-none pr-1">
                    {upcomingAuditorias.length > 0 ? (
                        upcomingAuditorias.map((audit) => {
                            const day = new Date(audit.fecha_inicial!).getDate();
                            return (
                                <div 
                                    key={audit.id}
                                    title={audit.razon_social || audit.empresa?.razon_social}
                                    className={`${audit.colorClass} text-white px-4 py-3 rounded-lg font-bold text-[11px] shadow-sm hover:opacity-90 transition-opacity cursor-pointer truncate`}
                                >
                                    {day}. Auditoría {audit.empresa?.razon_social || audit.razon_social}
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-gray-400 text-xs italic text-center py-8">
                            No hay auditorías programadas próximamente
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
