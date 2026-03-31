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

    // Obtener todas las tareas programadas (inicio de auditoría + subtareas)
    const allActivities = auditorias.flatMap((audit, index) => {
        const auditColor = colors[index % colors.length];
        const activities: any[] = [];

        // 1. Agregar el inicio de la auditoría
        if (audit.fecha_inicial) {
            activities.push({
                id: `audit-${audit.id}`,
                date: audit.fecha_inicial,
                title: `Inicio: ${audit.empresa?.razon_social || audit.razon_social || 'Auditoría'}`,
                colorClass: auditColor,
                empresa: audit.empresa?.razon_social || audit.razon_social
            });
        }

        // 2. Agregar todas las subtareas que tengan fecha de entrega
        audit.categorias?.forEach(cat => {
            cat.subtareas?.forEach(sub => {
                if (sub.tiempo_entrega) {
                    activities.push({
                        id: `sub-${sub.id}`,
                        date: sub.tiempo_entrega,
                        title: `${sub.nombre} (${audit.empresa?.razon_social || audit.razon_social || 'Auditoría'})`,
                        colorClass: auditColor,
                        empresa: audit.empresa?.razon_social || audit.razon_social,
                        isSubtarea: true
                    });
                }
            });
        });

        return activities;
    });

    // Ordenar todas las actividades por fecha para la lógica de agrupación
    const sortedAll = [...allActivities].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Obtener la actividad más próxima por cada empresa (única aparición en la lista)
    const nextActivityPerAudit = new Map<string, any>();
    
    sortedAll.forEach(act => {
        // Usamos el ID de la auditoría (que viene en el prefijo o podemos extraerlo)
        // Para simplificar, usaremos el nombre de la empresa como clave única
        const key = act.empresa || 'Empresa';
        const date = new Date(act.date);
        date.setHours(0, 0, 0, 0);
        const today = new Date();
        today.setHours(0,0,0,0);

        if (date.getTime() >= today.getTime() && !nextActivityPerAudit.has(key)) {
            nextActivityPerAudit.set(key, act);
        }
    });

    const upcomingActivities = Array.from(nextActivityPerAudit.values())
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 5); // Mostrar el top 5 de empresas próximas

    // Convertir a formato de eventos del calendario (AQUÍ SÍ SE MUESTRAN TODOS LOS PUNTOS)
    const calendarEvents: CalendarEvent[] = allActivities.map(act => ({
        date: act.date,
        title: act.title,
        color: act.colorClass
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
                <div className="flex-1 flex flex-col gap-3 justify-start overflow-y-auto max-h-[350px] lg:max-h-none pr-1 custom-scrollbar">
                    {upcomingActivities.length > 0 ? (
                        upcomingActivities.map((act) => {
                            // Parsear fecha manualmente para evitar desfases de zona horaria
                            const dParts = act.date.split('T')[0].split('-').map(Number);
                            const dateObj = new Date(dParts[0], dParts[1] - 1, dParts[2]);
                            
                            const day = dateObj.getDate();
                            const month = dateObj.toLocaleDateString('es-ES', { month: 'short' }).toUpperCase();

                            return (
                                <div 
                                    key={act.id}
                                    title={act.title}
                                    className={`${act.colorClass} text-white px-4 py-2.5 rounded-xl shadow-sm hover:opacity-90 transition-all hover:translate-x-1 cursor-pointer flex items-center gap-3 group`}
                                >
                                    <div className="flex flex-col items-center justify-center bg-white/20 rounded-lg py-1 px-2 min-w-[40px]">
                                        <span className="text-[14px] leading-none mb-0.5">{day}</span>
                                        <span className="text-[8px] opacity-80">{month}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-[12px] font-bold truncate">
                                            {act.empresa || 'Empresa'}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-gray-400 text-xs italic text-center py-8">
                            No hay actividades programadas próximamente
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
