import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface CalendarEvent {
    date: string; // ISO format (YYYY-MM-DD or full ISO)
    title: string;
    color?: string; // Tailwind bg class
}

interface CalendarProps {
    events?: CalendarEvent[];
}

export const Calendar: React.FC<CalendarProps> = ({ events = [] }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    // Date calculations
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    // Map events to days of the current month
    const eventsMap: Record<number, CalendarEvent[]> = {};
    events.forEach(event => {
        const date = new Date(event.date);
        // Normalize to local date string parts to avoid TZ issues
        const eventYear = date.getUTCFullYear();
        const eventMonth = date.getUTCMonth();
        const eventDay = date.getUTCDate();

        // Check if event is in current view (compensating for possible string input)
        // If the date string was "2024-03-31", new Date() might parse it differently
        // So we'll use a safer check
        const d = event.date.split('T')[0].split('-');
        const y = parseInt(d[0]);
        const m = parseInt(d[1]) - 1;
        const day = parseInt(d[2]);

        if (y === currentYear && m === currentMonth) {
            if (!eventsMap[day]) eventsMap[day] = [];
            eventsMap[day].push(event);
        }
    });

    const monthName = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(currentDate);
    const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);

    const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => (
        <div key={`blank-${i}`} className="h-8"></div>
    ));

    const dayCells = Array.from({ length: daysInMonth }, (_, i) => {
        const day = i + 1;
        const dayEvents = eventsMap[day] || [];
        const hasEvent = dayEvents.length > 0;

        // Use the first event's color or default
        const dotColor = dayEvents[0]?.color || 'bg-orange-500';

        return (
            <div key={`day-${day}`} className="h-8 flex items-center justify-center text-xs font-semibold text-gray-600 relative group">
                {hasEvent ? (
                    <>
                        <div className={`${dotColor} text-white w-6 h-6 flex items-center justify-center rounded-full shadow-sm z-10 transition-transform hover:scale-110 cursor-pointer`}>
                            {day}
                        </div>

                        {/* Premium Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-gray-800/90 backdrop-blur-md text-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-30 pointer-events-none min-w-[140px]">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="bg-white/20 px-1.5 py-0.5 rounded text-[10px] font-bold">
                                    {day}
                                </span>
                                <span className="text-[10px] font-medium opacity-80">
                                    {capitalizedMonth}
                                </span>
                            </div>
                            <div className="text-[11px] leading-tight font-semibold">
                                {dayEvents.map((e, idx) => (
                                    <div key={idx} className={idx > 0 ? "mt-1 pt-1 border-t border-white/10" : ""}>
                                        {e.title}
                                    </div>
                                ))}
                            </div>
                            {/* Arrow */}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800/90"></div>
                        </div>
                    </>
                ) : (
                    day
                )}
            </div>
        );
    });

    const weekDays = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];

    return (
        <div className="border border-gray-200 rounded-xl shadow-sm p-4 w-[280px] bg-white">
            <div className="flex items-center justify-between mb-6 px-1">
                <button onClick={handlePrevMonth} className="text-gray-400 hover:text-orange-500 transition-colors p-1">
                    <ChevronLeft size={16} />
                </button>
                <span className="font-bold text-gray-700 text-sm tracking-tight">{capitalizedMonth} {currentYear}</span>
                <button onClick={handleNextMonth} className="text-gray-400 hover:text-orange-500 transition-colors p-1">
                    <ChevronRight size={16} />
                </button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {weekDays.map(day => (
                    <span key={day} className="text-[9px] font-bold text-gray-400 tracking-wider font-sans">{day}</span>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-y-2 text-center">
                {blanks}
                {dayCells}
            </div>
        </div>
    );
};
