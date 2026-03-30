import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const ActivitySchedule: React.FC = () => {
    // Cálculo dinámico del mes actual
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    // Nombre del mes en español
    const monthName = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(now);
    const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);

    // Generar array de días (incluyendo espacios en blanco al inicio)
    const days = Array.from({ length: 42 }, (_, i) => {
        const dayNumber = i - firstDay + 1;
        return dayNumber > 0 && dayNumber <= totalDays ? dayNumber : '';
    });

    const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

    return (
        <div className="bg-white rounded-2xl shadow-xl p-6 h-full border border-gray-100 flex flex-col">
            <h3 className="text-xl font-semibold text-gray-800 text-center mb-6">Cronograma Actividades</h3>
            
            <div className="flex flex-col lg:flex-row gap-6 flex-grow">
                {/* Calendar Section */}
                <div className="flex-1 border rounded-xl p-4 border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-4 px-2">
                        <button className="text-gray-400 hover:text-gray-600">
                            <ChevronLeft size={20} />
                        </button>
                        <span className="font-bold text-gray-700">{capitalizedMonth} {currentYear}</span>
                        <button className="text-gray-400 hover:text-gray-600">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                    
                    <div className="grid grid-cols-7 gap-1 text-center">
                        {weekDays.map(day => (
                            <span key={day} className="text-[10px] font-bold text-gray-400 mb-2">{day}</span>
                        ))}
                        {days.map((day, idx) => (
                            <div key={idx} className="h-8 flex items-center justify-center text-sm font-medium text-gray-600 relative">
                                {day === 10 ? (
                                    <span className="bg-orange-500 text-white w-7 h-7 flex items-center justify-center rounded-full shadow-md z-10 transition-transform hover:scale-110 cursor-pointer">
                                        {day}
                                    </span>
                                ) : day === 19 ? (
                                    <span className="bg-blue-600 text-white w-7 h-7 flex items-center justify-center rounded-full shadow-md z-10 transition-transform hover:scale-110 cursor-pointer">
                                        {day}
                                    </span>
                                ) : (
                                    day
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Activities List */}
                <div className="flex-1 flex flex-col gap-3 justify-start">
                    <div className="bg-orange-500 text-white px-4 py-3 rounded-lg font-bold text-sm shadow-md hover:opacity-90 transition-opacity cursor-pointer">
                        10. Auditoria empresa XX
                    </div>
                    <div className="bg-blue-600 text-white px-4 py-3 rounded-lg font-bold text-sm shadow-md hover:opacity-90 transition-opacity cursor-pointer">
                         19. Auditoria empresa XX
                    </div>
                </div>
            </div>
        </div>
    );
};
