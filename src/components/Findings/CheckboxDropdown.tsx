import React, { useEffect, useRef, useState } from "react";

export interface CheckboxDropdownProps {
    label: string;
    placeholder: string;
    options: { value: string; label: string }[];
    selected: string[];
    onChange: (values: string[]) => void;
}

export function CheckboxDropdown({ label, placeholder, options, selected, onChange }: CheckboxDropdownProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const toggle = (val: string) =>
        onChange(selected.includes(val) ? selected.filter(v => v !== val) : [...selected, val]);

    const displayText =
        selected.length === 0
            ? placeholder
            : selected.length === 1
                ? options.find(o => o.value === selected[0])?.label ?? selected[0]
                : `${selected.length} seleccionados`;

    return (
        <div ref={ref} className="flex flex-col gap-1 min-w-[180px] relative">
            <label className="text-xs text-gray-500">{label}</label>
            <button
                type="button"
                onClick={() => setOpen(o => !o)}
                className="flex items-center justify-between px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 hover:border-orange-300"
            >
                <span className="truncate">{displayText}</span>
                <svg
                    className={`w-4 h-4 ml-2 text-gray-400 transition-transform shrink-0 ${open ? "rotate-180" : ""}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            {open && (
                <div className="absolute top-full left-0 mt-1 z-20 bg-white border border-gray-200 rounded-lg shadow-lg min-w-full py-1">
                    {selected.length > 0 && (
                        <button
                            type="button"
                            onClick={() => onChange([])}
                            className="w-full text-left px-3 py-1.5 text-xs text-orange-500 hover:bg-orange-50 border-b border-gray-100"
                        >
                            Limpiar selección
                        </button>
                    )}
                    {options.map(opt => (
                        <label key={opt.value} className="flex items-center gap-2.5 px-3 py-2 cursor-pointer hover:bg-gray-50">
                            <input
                                type="checkbox"
                                checked={selected.includes(opt.value)}
                                onChange={() => toggle(opt.value)}
                                className="w-4 h-4 rounded border-gray-300 accent-orange-500 cursor-pointer"
                            />
                            <span className="text-sm text-gray-700">{opt.label}</span>
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
}
