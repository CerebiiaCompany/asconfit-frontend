import React, { useEffect, useRef, useState } from "react";

interface DatePickerProps {
    value: string; // YYYY-MM-DD
    onChange: (val: string) => void;
    min?: string;
    max?: string;
    placeholder?: string;
}

const DAYS = ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sá"];
const MONTHS = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

function toDate(str: string) {
    const [y, m, d] = str.split("-").map(Number);
    return new Date(y, m - 1, d);
}

function toStr(date: Date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

export const DatePicker: React.FC<DatePickerProps> = ({
    value, onChange, min, max, placeholder = "dd/mm/aaaa",
}) => {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const today = new Date();
    const initial = value ? toDate(value) : today;
    const [viewYear, setViewYear] = useState(initial.getFullYear());
    const [viewMonth, setViewMonth] = useState(initial.getMonth());

    useEffect(() => {
        if (value) {
            const d = toDate(value);
            setViewYear(d.getFullYear());
            setViewMonth(d.getMonth());
        }
    }, [value]);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        if (open) document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [open]);

    const minDate = min ? toDate(min) : null;
    const maxDate = max ? toDate(max) : null;

    const isDisabled = (date: Date) => {
        if (minDate) {
            const minNorm = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate());
            const dateNorm = new Date(date.getFullYear(), date.getMonth(), date.getDate());
            if (dateNorm < minNorm) return true;
        }
        if (maxDate) {
            const maxNorm = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate());
            const dateNorm = new Date(date.getFullYear(), date.getMonth(), date.getDate());
            if (dateNorm > maxNorm) return true;
        }
        return false;
    };

    const isSelected = (date: Date) => value ? toStr(date) === value : false;
    const isToday = (date: Date) => toStr(date) === toStr(today);

    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const cells: (Date | null)[] = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(viewYear, viewMonth, d));

    const prevMonth = () => {
        if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
        else setViewMonth(m => m - 1);
    };
    const nextMonth = () => {
        if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
        else setViewMonth(m => m + 1);
    };

    const displayValue = value
        ? toDate(value).toLocaleDateString("es-CO", { day: "2-digit", month: "2-digit", year: "numeric" })
        : "";

    return (
        <div ref={ref} className="relative">
            <button
                type="button"
                onClick={() => setOpen(o => !o)}
                className="w-full flex items-center justify-between px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
            >
                <span className={displayValue ? "text-gray-800" : "text-gray-400"}>{displayValue || placeholder}</span>
                <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            </button>

            {open && (
                <div className="absolute z-50 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg p-3 w-64">
                    <div className="flex items-center justify-between mb-2">
                        <button type="button" onClick={prevMonth} className="p-1 rounded hover:bg-gray-100 text-gray-500">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <span className="text-sm font-medium text-gray-700">{MONTHS[viewMonth]} {viewYear}</span>
                        <button type="button" onClick={nextMonth} className="p-1 rounded hover:bg-gray-100 text-gray-500">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>

                    <div className="grid grid-cols-7 mb-1">
                        {DAYS.map(d => (
                            <div key={d} className="text-center text-[10px] font-medium text-gray-400 py-1">{d}</div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-y-0.5">
                        {cells.map((date, i) => {
                            if (!date) return <div key={i} />;
                            const disabled = isDisabled(date);
                            const selected = isSelected(date);
                            const todayMark = isToday(date);
                            return (
                                <button
                                    key={i}
                                    type="button"
                                    disabled={disabled}
                                    onClick={() => { onChange(toStr(date)); setOpen(false); }}
                                    className={[
                                        "w-8 h-8 mx-auto rounded-full text-xs transition-colors flex items-center justify-center",
                                        disabled ? "text-gray-300 cursor-not-allowed" : "cursor-pointer",
                                        selected ? "bg-orange-500 text-white" : "",
                                        !disabled && !selected && todayMark ? "font-bold text-orange-500" : "",
                                        !disabled && !selected ? "hover:bg-orange-50 hover:text-orange-600 text-gray-700" : "",
                                    ].join(" ")}
                                >
                                    {date.getDate()}
                                </button>
                            );
                        })}
                    </div>

                    {value && (
                        <button
                            type="button"
                            onClick={() => { onChange(""); setOpen(false); }}
                            className="mt-1 w-full text-[10px] text-gray-400 hover:text-red-400 transition-colors"
                        >
                            Borrar
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};
